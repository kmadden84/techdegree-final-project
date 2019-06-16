var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  options: { 
    modules: true
  },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
       ]
    },
}