module.exports = function override(config, env) {
  // Исключаем face-api.js из обработки source-map-loader
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules\/face-api\.js/
  });
  
  return config;
};