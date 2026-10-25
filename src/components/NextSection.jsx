// Layout here uses Bootstrap's grid (container / row / col-*), styled with Tailwind utilities.
export default function NextSection() {
  return (
    <section id="more" className="bg-tide py-28 text-foam md:py-40">
      <div className="container px-6 md:px-12">
        <div className="row gy-5 align-items-end">
          <div className="col-12 col-lg-7">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Parcels arrive where people already are.
            </h2>
          </div>
          <div className="col-12 col-lg-5 lg:pl-12">
            <p className="mb-8 max-w-[44ch] text-lg leading-relaxed text-foam/75">
              Pick-up points near home, work and the station mean fewer missed deliveries, fewer
              support calls and a lower cost for every parcel.
            </p>
            <a
              href="#top"
              className="inline-block rounded-full bg-coral px-7 py-3.5 font-semibold text-tide transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-foam"
            >
              Back to the top
            </a>
          </div>
        </div>
        <p className="mt-24 text-sm text-foam/55">Built with Next.js, Tailwind CSS, Bootstrap grid, GSAP and Lenis.</p>
      </div>
    </section>
  );
}
