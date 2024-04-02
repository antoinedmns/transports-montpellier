//@ts-ignore
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': 'standard-with-typescript',
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script',
                'project': ['./tsconfig.json'],
            },
        },
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {

        /**
         * Style-related rules
         */
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/indent': ['error', 4],
        'padded-blocks': ['error', 'always'],
        'no-trailing-spaces': 'off',

        /**
         * Typescript-related rules
         */
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'no-unreachable': 'warn',
        'curly': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'padded-blocks': 'off',
        '@typescript-eslint/no-extraneous-class': 'off' // eslint considers utility classes as extraneous
    }
}