module.exports = {
    entry: './src/main.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'babel?presets[]=es2015!ts',
                exclude: /node_modules/
            },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.woff$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.woff2$/, loader: 'url?limit=10000&mimetype=application/font-woff2' },
            { test: /\.ttf$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot$/, loader: 'file' },
            { test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081/',
                secure: false
            }
        }
    }
}
