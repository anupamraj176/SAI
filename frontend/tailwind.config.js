/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌿 FarmerHub Green Palette
        evergreen: '#1F3326',
        emerald: '#347B66',
        sage: '#6FA99F',
        'lime-cream': '#CFF56E',
        forest: '#3B4A38',
        olive: '#6B765C',
        pine: '#1C2D2A',
        charcoal: '#0E1719',
        moss: '#BABA9E',
      },
    },
  },
  plugins: [],
};
