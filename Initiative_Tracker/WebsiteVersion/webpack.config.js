module.exports = {
    entry: {
        main: './src/index.js',
        addCharacter: './src/addCharacter.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    }
};