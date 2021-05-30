const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const os = require('os');
module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    const imageRule = config.module.rule('images');
    const gameAssetRule = config.module.rule('gameAssets');
    //const jsonRule = config.module.rule('GameAtlas')

    //ggf noch fallback
    imageRule.uses.clear();
    gameAssetRule.uses.clear();
    imageRule
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .exclude.add(/node_modules/)
      .add(/src\/game\/gameAssets/)
      .add(/src\\game\\gameAssets/)
      .end()
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => {
        limit = 4096;
        // fallback = 'file-loader'
        // fallback.options.name = 'img/[name].[hash:8].[ext]'
        return options;
      })
      .end();
    // // add replacement loader(s)
    gameAssetRule
      .test(/\.(jpe?g|png|gif|svg)$/i)
      .include.add(/src\/game\/gameAssets/)
      .add(/src\\game\\gameAssets/)
      .end()
      .use('file-loader')
      .loader('file-loader?name=[name].[ext]')
      .end();

    // jsonRule
    // .test(/\.(json)$/i)
    // .include
    // .add(/src\/game\/gameAssets/)
    // .end()
    //   .use('json-loader')
    //     .loader('json-loader?name=[name].[ext]')
    //     .end()
    config.plugin('fork-ts-checker').tap((args) => {
      let totalmem = Math.floor(os.totalmem() / 1024 / 1024);
      let allowUseMem = totalmem > 12000 ? 4096 : 1000;
      args[0].memoryLimit = allowUseMem;
      return args;
    });
  },
  //CORS Error Fix
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
};
