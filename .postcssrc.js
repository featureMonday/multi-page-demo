module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    autoprefixer: { browsers: ['Android >= 4.0', 'iOS >= 7'] },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propWhiteList: ['*'], // 配置pxtorem白名单
      selectorBlackList: [], // 配置pxtorem黑名单
    },
  },
};
