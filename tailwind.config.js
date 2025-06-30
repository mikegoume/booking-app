/** @type {import('tailwindcss').Config} */
const { platformSelect } = require("nativewind/theme");

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  extend: {
    colors: {
      error: platformSelect({
        ios: "red",
        android: "blue",
        default: "green",
      }),
    },
  },
  plugins: [],
};
