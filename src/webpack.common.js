const path = require('path')

module.exports = {
    entry: 
    './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[contenthash].js'
      },
    module: {
        rules: [
            {
                loader: 'worker-loader',
                test: /\.worker\.js$/,    
                options: {
                    filename: '[contenthash].js'
                  }            
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
}