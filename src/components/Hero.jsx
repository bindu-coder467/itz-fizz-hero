"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/data/stats";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["WELCOME", "ITZFIZZ"];
const CAR_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/car.svg`;
// Mobile card placement by index (desktop uses the % from data/stats.js)
const MOBILE_SIDE = ["left-[4%]", "left-[4%]", "right-[4%]", "right-[4%]"];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const letters = q(".letter");
        const cards = q("[data-stat]");
        const wraps = q("[data-stat-wrap]");
        const nums = q("[data-num]");
        const track = q(".car-track")[0];
        const sway = q(".car-sway")[0];
        const trail = q(".trail")[0];
        const road = q(".road")[0];
        const bar = q(".progress-bar")[0];
        const hint = q(".scroll-hint")[0];
        const hintText = q(".hint-text")[0]; // fades with scroll; the outer element fades in with the intro

        /* ---------- Reduced motion: finished state, no pinning ---------- */
        if (context.conditions.reduce) {
          letters.forEach((l) => l.style.setProperty("--f", "1"));
          wraps.forEach((w) => w.style.setProperty("--lit", "1"));
          gsap.set(trail, { scaleX: 1 });
          gsap.set(track, { x: () => window.innerWidth - track.offsetWidth - 24 });
          nums.forEach((n) => (n.textContent = n.dataset.num + "%"));
          return;
        }

        /* ---------- Geometry (re-read on every ScrollTrigger refresh) ---------- */
        const carW = () => track.offsetWidth;
        const startX = () => -carW() * 0.5;       // car centre starts at the left edge (trail starts at 0)
        const endX = () => window.innerWidth;     // and drives fully off the right
        let letterX = [];
        let cardX = [];
        const letterState = new Array(letters.length).fill(-1);
        const cardState = new Array(wraps.length).fill(-1);
        let tl;

        const measure = () => {
          // The road wipes in from scaleX(0) during the intro, which would squash every measurement.
          // Skip until it is full width; the intro's onComplete triggers a fresh refresh.
          if (Number(gsap.getProperty(road, "scaleX")) < 0.999) return;
          const centre = (el) => {
            const r = el.getBoundingClientRect();
            return r.left + r.width / 2;
          };
          letterX = letters.map(centre);
          cardX = wraps.map(centre);
        };

        // The trail's leading edge is the car's centre. Letters fill, and cards light up, as it passes.
        // Writes only when a value changes, so scrolling stays cheap.
        const paint = () => {
          if (!tl || !letterX.length) return;
          const p = tl.progress();
          const carCentre = startX() + (endX() - startX()) * p + carW() / 2;
          letters.forEach((l, i) => {
            const f = Math.round(clamp((carCentre - letterX[i]) / 40 + 0.5, 0, 1) * 20) / 20;
            if (f !== letterState[i]) {
              letterState[i] = f;
              l.style.setProperty("--f", f);
            }
          });
          wraps.forEach((w, i) => {
            const lit = carCentre >= cardX[i] ? 1 : 0;
            if (lit !== cardState[i]) {
              cardState[i] = lit;
              w.style.setProperty("--lit", lit);
            }
          });
        };

        /* ---------- 1. Intro (time-based, once on load) ---------- */
        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => ScrollTrigger.refresh(), // re-measure now that the layout is final
        });
        intro
          .fromTo(".nav", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
          .fromTo(".road", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1.4, ease: "power4.inOut" }, 0.1)
          .fromTo(letters, { opacity: 0, yPercent: 80 }, { opacity: 1, yPercent: 0, duration: 1.4, stagger: 0.055 }, 0.7)
          .fromTo(".car-intro", { opacity: 0, xPercent: -14 }, { opacity: 1, xPercent: 0, duration: 1.6 }, 0.9)
          .fromTo(cards, { opacity: 0, y: 36, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.18 }, 1.5)
          .fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 1 }, 2.4);

        nums.forEach((el, i) => {
          const counter = { v: 0 };
          el.textContent = "0%";
          gsap.to(counter, {
            v: Number(el.dataset.num),
            duration: 1.9,
            delay: 1.55 + i * 0.18,
            ease: "power3.out",
            onUpdate: () => (el.textContent = Math.round(counter.v) + "%"),
          });
        });

        /* ---------- 2. Scroll-driven timeline (progress 0 → 1 across the pinned distance) ---------- */
        tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: paint,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * (window.innerWidth < 768 ? 2.2 : 2.8),
            pin: true,
            scrub: 1.1, // the lag is the easing: motion glides toward the scroll position
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              paint();
            },
          },
        });

        tl.fromTo(track, { x: startX }, { x: endX, duration: 1 }, 0)
          // trail is a full-width bar scaled from the left; its edge always equals the car's centre
          .fromTo(
            trail,
            { scaleX: () => (startX() + carW() / 2) / window.innerWidth },
            { scaleX: () => (endX() + carW() / 2) / window.innerWidth, duration: 1 },
            0
          )
          // a little body sway so the car feels alive while it travels
          .to(sway, { keyframes: [{ y: -4 }, { y: 3 }, { y: -3 }, { y: 2 }, { y: 0 }], duration: 1 }, 0)
          .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .to(hintText, { opacity: 0, duration: 0.04 }, 0);

        return () => intro.kill();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-foam">
      {/* Nav */}
      <header data-intro className="nav absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-12 md:py-7">
        <span className="text-xl font-bold tracking-tight">Itz Fizz</span>
        <a
          href="#more"
          className="rounded-full border border-tide/30 px-5 py-2 text-sm font-medium transition-colors duration-300 hover:bg-tide hover:text-foam"
        >
          Get in touch
        </a>
      </header>

      {/* Road band, centred vertically */}
      <div className="stage absolute inset-x-0">
        <div className="road relative">
          {/* Trail: scaled from the left, edge = car centre */}
          <div className="trail absolute inset-0 origin-left scale-x-0 will-change-transform" aria-hidden="true" />

          {/* Headline */}
          <h1
            aria-label="Welcome Itz Fizz"
            className="headline absolute inset-0 flex flex-col items-center justify-center gap-y-1 font-bold leading-[0.95] md:flex-row md:gap-x-[0.7em]"
          >
            {WORDS.map((word) => (
              <span key={word} aria-hidden="true" className="flex overflow-hidden py-[0.06em]">
                {word.split("").map((ch, i) => (
                  <span key={i} data-intro className="letter">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Car (top view). Outer = scroll x, middle = intro, inner = sway */}
          <div className="car-track absolute left-0 z-20 will-change-transform">
            <div className="car-intro h-full w-full" data-intro>
              <div className="car-sway h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CAR_SRC} alt="Orange sports car seen from above" className="car-img" draggable="false" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards, positioned around the road */}
      {stats.map((s, i) => {
        const top = s.place.side === "top";
        return (
          <div
            key={s.text + i}
            data-stat-wrap
            style={{ "--x": `${s.place.x}%` }}
            className={`stat-wrap z-10 ${MOBILE_SIDE[i]} md:left-[var(--x)] md:right-auto ${top ? "stat-top" : "stat-bottom"}`}
          >
            <div data-stat data-intro className={`stat-card stat-${s.tone} shadow-[0_18px_40px_-18px_rgba(13,44,53,0.45)]`}>
              <p data-num={s.value} className="stat-num">
                {s.value}%
              </p>
              <p className="stat-text">{s.text}</p>
            </div>
          </div>
        );
      })}

      {/* Scroll hint + progress meter */}
      <p data-intro className="scroll-hint absolute bottom-4 left-1/2 z-30 -translate-x-1/2 text-xs font-medium text-tide/70 md:text-sm">
        <span className="hint-text">Scroll to drive</span>
      </p>
      <div className="absolute inset-x-0 bottom-0 z-30 h-[3px] bg-tide/10">
        <div className="progress-bar h-full origin-left scale-x-0 bg-coral" />
      </div>
    </section>
  );
}
