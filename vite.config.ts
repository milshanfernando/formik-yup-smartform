import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "FormikYupSmartForm",
      fileName: (format) => `formik-yup-smartform.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"], // don’t bundle React
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
