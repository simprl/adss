export default [
    {
        input: 'src/index.js',
        output: { file: 'es/adss.js', format: 'es', indent: false },
    },
    {
        input: 'src/index.js',
        output: { file: 'lib/adss.js', format: 'cjs', indent: false },
    },
]