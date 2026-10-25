/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        tide: "#0D2C35",     // page background
        lagoon: "#14434F",   // glow / surfaces
        asphalt: "#071C22",  // road
        foam: "#F4EFCB",     // text + lit letters
        coral: "#FF5B6B",    // the car, key actions
        mint: "#8BE3C8",     // quiet secondary
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  // Bootstrap's grid provides .container, so Tailwind's own .container is switched off to avoid two competing definitions.
  corePlugins: { container: false },
  plugins: [],
};
