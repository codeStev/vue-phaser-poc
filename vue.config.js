module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    
     const imageRule = config.module.rule('images')
     const gameAssetRule = config.module.rule('gameAssets')
     const jsonRule = config.module.rule('GameAtlas')

    //ggf noch fallback
    imageRule.uses.clear()
    gameAssetRule.uses.clear()
    imageRule
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .exclude
    .add(/node_modules/)
    .add(/src\/assets\/gameAssets/)
    .add(/src\\assets\\gameAssets/)
    .end()
    .use('url-loader')
    .loader('url-loader')
    .tap(options => {
      limit = 4096
      // fallback = 'file-loader' 
      // fallback.options.name = 'img/[name].[hash:8].[ext]'
      return options
    })
    .end()
    // // add replacement loader(s)
     gameAssetRule
     .test(/\.(jpe?g|png|gif|svg|mp3)$/i)
     .include
     .add(/src\/assets\/gameAssets/)
     .add(/src\\assets\\gameAssets/)
     .end()
       .use('file-loader')
         .loader('file-loader?name=[name].[ext]')
         .end()

      // jsonRule
      // .test(/\.(json)$/i)
      // .include
      // .add(/src\/assets\/gameAssets/)
      // .end()
      //   .use('json-loader')
      //     .loader('json-loader?name=[name].[ext]')
      //     .end()
      
  }
  
}
