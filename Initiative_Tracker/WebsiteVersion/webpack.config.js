module.exports = {
    entry: {
        main: './src/index.js',
        userOptions: './src/user-options.js',
        login: './src/login.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    }
};