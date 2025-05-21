/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Asegúrate de que el modo oscuro esté habilitado
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#153854", // Define tu color personalizado
        amarillobtn: "#c78f28",
        fondoClaro: "#FFFFFF",
        fondoObscuro: "#000e21",
        cardClaro: "#93BFE4",
        cardObscuro: "#22252e",
      },
    },
  },
  plugins: [],
};
