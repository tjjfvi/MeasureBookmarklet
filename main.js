$(function(){
	const regex = /^(r?)\s?(\d+(?:\.\d+)?)(\w\w|)(?:\s?x\s?(\d+(?:\.\d+)?)(\w\w|))?$/;
	const splitRegex = /^r?\s?(\d+(?:\.\d+)?(?:\w\w|))\s?x\s?(\d+(?:\.\d+)?(?:\w\w|)$)/;
	const propertyArr = ["width", "height"];

	let m;
	try {
		m = decodeURIComponent(window.location.search.slice(1).split("&").map(s => s.split("=")).filter(a => a[0] === "m")[0][1]);
	} catch(e) {}

	if(!m) throw error("NoM");

	let $boxes = $(m.split(/\s?vs\s?/).map((m, i) => {

		const $box = $('<div class="measurement"><span style="font-size: 30px;"></span></div>').appendTo("body");
		const $text = $box.children("span");

		let match = regex.exec(m);
		if(!match) throw error("BadM");
		m = m.split(splitRegex).filter(a=>a).map(a => !isNaN(a) ? a + "px" : a.replace("um", "μm")).join(" × ");

		[match[2] + match[3], match[4] + match[5]].filter(a=>a).map((m, i) =>
			$box.css(propertyArr[i], getCssUnit(m))
		);

		if(match[1]) $box.addClass("rounded")

		$text.text(m);
		$("title").text("Measure");

		let n = 30;/*

		let overflowing = () => ($text.width() + 5 > $box.width() || $text.height() + 2 > $box.height());
		let textSize = () => +$text.css("font-size").slice(0, -2);

		if(overflowing() && $box.height() > $box.width()) $text.addClass("vertical");

		while (overflowing() && textSize() > 10) $text.css("font-size", textSize() - 2)*/

		return $box;

	}));

	[...$boxes].map(e => $(e)).sort((a, b) =>
		a.width() *  a.height() - b.width() * b.height()
	).map($e => $e.css("opacity", 1 / $boxes.length).prependTo("body").mouseenter(function(){
		$(".measurement").addClass("hide");
		$(this).removeClass("hide").addClass("show");
	}).mouseleave(function(){{
		$(".measurement").removeClass("hide show");
	}}));

	function getCssUnit(m){
		let [val, unit] = m.split(/(^\d*\.?\d+)(?=[a-z]+$)/).slice(1);

		let meterSubdivs = "unpfazy".split("").map(s => s + "m");
		let baseUnits = "in cm mm px".split(" ");

		if(baseUnits.indexOf(unit) !== -1) return m;
		else if(!unit) return (m = m + "px");
		else if(meterSubdivs.indexOf(unit) === -1) throw error("BadU")

		return (+val) / 1000 ** (1 + meterSubdivs.indexOf(unit)) + "mm";
	}

	function error(type){
		$("body").addClass(`error error${type}`);
		return new Error(type);
	}
})
