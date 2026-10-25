/**
 * Itz Fizz Hero — vanilla JS (GSAP + ScrollTrigger + Lenis).
 *
 * 1. Intro   : time-based timeline on load (road wipes in, letters rise, car slides in,
 *              stat cards pop in one by one and count up).
 * 2. Scroll  : the hero is pinned and one scrubbed timeline drives the car's x position.
 *              The trail's leading edge is the car's centre; letters fill and cards "light up"
 *              as the car passes them.
 * Only transform / opacity animate. Letter and card positions are measured once per refresh.
 */
(function () {
	"use strict";

	var hero = document.querySelector("[data-hero]");
	if (!hero || !window.gsap || !window.ScrollTrigger) return;

	gsap.registerPlugin(ScrollTrigger);

	var $ = function (sel) { return hero.querySelector(sel); };
	var $$ = function (sel) { return Array.prototype.slice.call(hero.querySelectorAll(sel)); };
	var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

	// Height of the WordPress admin bar (0 for logged-out visitors). Pinning starts below it.
	var adminBar = function () {
		return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ab")) || 0;
	};

	var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	var letters = $$("[data-letter]");
	var wraps = $$("[data-stat-wrap]");
	var cards = $$("[data-stat]");
	var nums = $$("[data-num]");
	var track = $("[data-car]");
	var sway = $("[data-sway]");
	var trail = $("[data-trail]");
	var road = $("[data-road]");
	var bar = $("[data-bar]");
	var hint = $("[data-hint]");
	var hintText = $("[data-hint-text]"); // fades with scroll; the outer element fades in with the intro
	var nav = $(".iz-nav");

	/* ---------- Reduced motion: finished state, no pinning, no smooth scroll ---------- */
	if (reduce) {
		letters.forEach(function (l) { l.style.setProperty("--f", "1"); });
		wraps.forEach(function (w) { w.style.setProperty("--lit", "1"); });
		gsap.set(trail, { scaleX: 1 });
		gsap.set(track, { x: window.innerWidth - track.offsetWidth - 24 });
		return;
	}

	/* ---------- Smooth scrolling (Lenis, driven by GSAP's ticker) ---------- */
	if (window.Lenis) {
		var lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
		lenis.on("scroll", ScrollTrigger.update);
		gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
		gsap.ticker.lagSmoothing(0);
	}

	/* ---------- Geometry (re-read on every ScrollTrigger refresh) ---------- */
	var carW = function () { return track.offsetWidth; };
	var startX = function () { return -carW() * 0.5; };   // car centre starts at the left edge
	var endX = function () { return window.innerWidth; }; // and drives fully off the right
	var letterX = [];
	var cardX = [];
	var letterState = letters.map(function () { return -1; });
	var cardState = wraps.map(function () { return -1; });
	var tl;

	function centre(el) {
		var r = el.getBoundingClientRect();
		return r.left + r.width / 2;
	}
	function measure() {
		// The road wipes in from scaleX(0) during the intro, which would squash every measurement.
		// Skip until it is full width; the intro's onComplete triggers a fresh refresh.
		if (Number(gsap.getProperty(road, "scaleX")) < 0.999) return;
		letterX = letters.map(centre);
		cardX = wraps.map(centre);
	}
	// Writes only when a value changes, so scrolling stays cheap.
	function paint() {
		if (!tl || !letterX.length) return;
		var carCentre = startX() + (endX() - startX()) * tl.progress() + carW() / 2;
		letters.forEach(function (l, i) {
			var f = Math.round(clamp((carCentre - letterX[i]) / 40 + 0.5, 0, 1) * 20) / 20;
			if (f !== letterState[i]) { letterState[i] = f; l.style.setProperty("--f", f); }
		});
		wraps.forEach(function (w, i) {
			var lit = carCentre >= cardX[i] ? 1 : 0;
			if (lit !== cardState[i]) { cardState[i] = lit; w.style.setProperty("--lit", lit); }
		});
	}

	/* ---------- 1. Intro ---------- */
	var intro = gsap.timeline({
		defaults: { ease: "expo.out" },
		onComplete: function () { ScrollTrigger.refresh(); } // re-measure now that the layout is final
	});
	intro
		.fromTo(nav, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
		.fromTo(road, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1.4, ease: "power4.inOut" }, 0.1)
		.fromTo(letters, { opacity: 0, yPercent: 80 }, { opacity: 1, yPercent: 0, duration: 1.4, stagger: 0.055 }, 0.7)
		.fromTo("[data-car-intro]", { opacity: 0, xPercent: -14 }, { opacity: 1, xPercent: 0, duration: 1.6 }, 0.9)
		.fromTo(cards, { opacity: 0, y: 36, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.18 }, 1.5)
		.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 1 }, 2.4);

	nums.forEach(function (el, i) {
		var counter = { v: 0 };
		el.textContent = "0%";
		gsap.to(counter, {
			v: Number(el.getAttribute("data-num")),
			duration: 1.9,
			delay: 1.55 + i * 0.18,
			ease: "power3.out",
			onUpdate: function () { el.textContent = Math.round(counter.v) + "%"; }
		});
	});

	/* ---------- 2. Scroll-driven timeline ---------- */
	tl = gsap.timeline({
		defaults: { ease: "none" },
		onUpdate: paint,
		scrollTrigger: {
			trigger: hero,
			start: function () { return "top top+=" + adminBar(); },
			end: function () { return "+=" + window.innerHeight * (window.innerWidth < 768 ? 2.2 : 2.8); },
			pin: true,
			scrub: 1.1, // the lag is the easing: motion glides toward the scroll position
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onRefresh: function () { measure(); paint(); }
		}
	});

	tl.fromTo(track, { x: startX }, { x: endX, duration: 1 }, 0)
		.fromTo(
			trail,
			{ scaleX: function () { return (startX() + carW() / 2) / window.innerWidth; } },
			{ scaleX: function () { return (endX() + carW() / 2) / window.innerWidth; }, duration: 1 },
			0
		)
		.to(sway, { keyframes: [{ y: -4 }, { y: 3 }, { y: -3 }, { y: 2 }, { y: 0 }], duration: 1 }, 0)
		.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
		.to(hintText, { opacity: 0, duration: 0.04 }, 0);

	// Fonts change letter widths, so re-measure once they're ready.
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
	}
})();
