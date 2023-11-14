/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        "bg-accent-gray": "rgba(0, 0, 0, 0.2)",
      },
      width: {
        500: "500px",
      },
      margin: {
        t3: "3px",
        lp: "calc((100vh - 402px) / 2) auto",
        sp: "calc((100vh - 602px) / 2) auto",
      },
      maxHeight: {
        vh: "90vh",
      },
    },
    minWidth: {
      4: "16px",
    },
  },
  plugins: [],
  safelist: ["lp", "sp", "bg-accent-gray"],
};
