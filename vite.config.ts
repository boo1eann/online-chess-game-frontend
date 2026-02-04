import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "chessboard-module.js": path.resolve(
        __dirname,
        "src/vendor/chessboard-module.js",
      ),
    },
  },
});
