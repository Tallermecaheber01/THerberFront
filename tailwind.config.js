/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Asegúrate de que el modo oscuro esté habilitado
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#293d57", // Define tu color personalizado
        amarillobtn: "#c78f28",
        fondoClaro: "#071426",
        fondoObscuro: "#000e21",
        cardClaro: "#393e4d",
        cardObscuro: "#22252e",
      },
    },
  },
  plugins: [],
};
