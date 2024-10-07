import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-epilogue)", ...fontFamily.sans],
        accent: ["var(--font-safira)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
