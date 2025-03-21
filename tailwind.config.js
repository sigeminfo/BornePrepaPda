/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lblueBase: 'rgba(53, 211, 210, 1)',
        lblueHover: 'rgba(32, 172, 171, 1)',
        lblueLight: 'rgba(53, 211, 210, 0.15)',
        lblueLightHover: 'rgba(53, 211, 210, 0.3)',

        dblueBase: 'rgba(11, 72, 157, 1)',
        dblueHover: 'rgba(0, 50, 119, 1)',
        dblueLight: 'rgba(11, 72, 157, 0.1)',
        dblueLightHover: 'rgba(11, 72, 157, 0.2)',

        orangeBase: 'rgba(254, 95, 0, 1)',
        orangeHover: 'rgba(208, 78, 0, 1)',
        orangeLight: 'rgba(254, 95, 0, 0.1)',
        orangeLightHover: 'rgba(254, 95, 0, 0.25)',

        yellowBase: 'rgba(253, 224, 71,1)',
        yellowHover: 'rgba(250, 204, 21,1)',
        yellowLight: 'rgba(253, 224, 71,0.2)',
        yellowLightHover: 'rgba(253, 224, 71,0.4)',

        redBase: 'rgba(239, 68, 68, 1)',
        redHover: 'rgba(220, 38, 38, 1)',
        redLightlign: 'rgba(239, 68, 68, 0.15)',
        redLightHover: 'rgba(239, 68, 68, 0.3)',

        greenBase: 'rgba(74, 222, 128, 1)',
        greenHover: 'rgba(34, 197, 94, 1)',
        greenLight: 'rgba(74, 222, 128, 0.15)',
        greenLightHover: 'rgba(74, 222, 128, 0.3)',

        grayBase: 'rgba(114, 120, 126, 1)',
        grayHover: 'rgba(90, 94, 98, 1)',

        lgrayBase: 'rgba(245, 245, 245, 1)',
        lgrayHover: 'rgba(222, 222, 222, 1)',
      },
      fontFamily: {
        'corps': ['"Hanken Grotesk"', 'sans-serif'],
        'titre': ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
