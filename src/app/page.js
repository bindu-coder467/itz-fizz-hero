import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import NextSection from "@/components/NextSection";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <NextSection />
      </main>
    </SmoothScroll>
  );
}
