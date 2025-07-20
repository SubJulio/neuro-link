module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Находим правило для source-map-loader
      const rule = webpackConfig.module.rules.find(
        (rule) => rule.enforce === 'pre' && rule.use?.loader?.includes('source-map-loader')
      );
      
      // Добавляем исключение для face-api.js
      if (rule) {
        rule.exclude = /node_modules\/face-api\.js/;
      }
      
      return webpackConfig;
    }
  }
};