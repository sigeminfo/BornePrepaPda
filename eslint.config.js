import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { 
      globals: globals.browser 
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      'no-undef-init': 'warn',
      'no-var': 'warn',
      "semi": ['warn', 'always'],
      'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],
      "no-extra-semi": "warn",
      "default-case": 'warn',
      'no-array-constructor': 'warn',
      'no-class-assign': 'warn',
      'no-compare-neg-zero': 'warn',
      'no-cond-assign': ['warn', 'always'],
      'no-const-assign': 'warn',
      "no-console": 'warn',
      "no-misleading-character-class": 'warn',
      'no-unneeded-ternary': ['warn', { defaultAssignment: false }],
      'no-redeclare': ['warn', { builtinGlobals: false }],
      'no-self-assign': ['warn', { props: true }],
      'no-import-assign': 'warn',
      'no-delete-var': 'warn',
      'no-dupe-args': 'warn',
      'no-dupe-keys': 'warn',
      'no-duplicate-case': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-func-assign': 'warn',
      "no-multi-assign": 'warn',
      "no-shadow-restricted-names": 'warn',
      "no-sparse-arrays": 'warn',
      "no-template-curly-in-string": 'warn',
      "no-this-before-super": 'warn',
      "prefer-object-spread": 'warn',
      "prefer-rest-params": 'warn',
      "prefer-spread": 'warn',
      "prefer-template": 'warn',
      "no-duplicate-imports": 'warn',
      "no-unreachable-loop": 'warn',
      "arrow-body-style": ['warn', 'as-needed'],
    }
  }
];