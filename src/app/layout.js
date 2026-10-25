import "@fontsource-variable/bricolage-grotesque";
// Bootstrap: grid classes only (see scripts/make-bootstrap-grid.js). Its !important spacing utilities are left out on purpose, as they would override Tailwind.
import "@/styles/bootstrap-grid-lite.css";
import "./globals.css";

export const metadata = {
  title: "Itz Fizz — Scroll-driven hero",
  description: "A scroll-driven hero animation built with Next.js, Tailwind CSS, Bootstrap grid and GSAP.",
};

export const viewport = { themeColor: "#F4EFCB" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* If JS is off, never leave intro elements hidden. */}
        <noscript>
          <style>{`[data-intro]{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
