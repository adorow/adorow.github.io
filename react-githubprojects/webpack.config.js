var path = require('path');

// https://webpack.js.org/configuration/

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../js/generated/react/githubprojects')
    },

    module: {
        rules: [
            {
                test: /\.scss$/,


                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: ["../_sass/"]
                    }
                }]
            },

            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}

        ]
    }
};



