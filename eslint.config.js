import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/', 'out/', 'node_modules/'] },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended]
  },
  {
    files: ['src/**/*.ts', 'types/**/*.d.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // 类型由 TypeScript 检查，无需 ESLint 重复判定
      'no-undef': 'off',
      // 与 ts-standard 保持一致：允许仅继承单一类型的空接口
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }]
    }
  }
)
