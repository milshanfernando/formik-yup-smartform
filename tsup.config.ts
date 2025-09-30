import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  clean: true,
  external: ["react", "react-dom"],
  splitting: false,
  sourcemap: true,
  minify: true,
  // Build Tailwind CSS when tsup finishes
  onSuccess: "tailwindcss -i ./src/index.css -o ./dist/style.css --minify",
});
