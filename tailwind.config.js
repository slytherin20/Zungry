/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      /*   margin: {
        lp: "calc((100vh - 402px) / 2) auto",
        sp: "calc((100vh - 602px) / 2) auto",
      },
    },
    backgroundColor: {
      "bg-accent-gray": "rgba(0, 0, 0, 0.2)",
    },*/
    },
  },
  plugins: [],
  safelist: ["lp", "sp", "bg-accent-gray"],
};
