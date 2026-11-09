import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["dist/", "out/"]),

  // 核心推荐规则：适用于所有文件，与 TS 冲突的条目由 tseslint 关闭
  js.configs.recommended,

  // TS 专属规则：仅作用于 TypeScript 文件，避免在 JS 上使用 TS 解析器
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Downgraded from error
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
);
