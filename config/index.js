const pxtransform = require('postcss-pxtransform');

const config = {
  projectName: 'taro-react-vant',
  date: '2022-5-21',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  mini: {
    webpackChain(chain) {
      const lessRule = chain.module.rules.get('less');
      const lessRuleCfg = {
        test: /@antmjs[\\/]vantui(.+?)\.less$/,
        oneOf: [
          {
            use: [],
          },
        ],
      };
      lessRule.toConfig().oneOf[0].use.map((use) => {
        if (/postcss-loader/.test(use.loader)) {
          const newUse = {
            loader: use.loader,
            options: {
              sourceMap: use.options.sourceMap,
              postcssOptions: {
                plugins: [],
              },
            },
          };
          use.options.postcssOptions.plugins.map((xitem) => {
            if (xitem.postcssPlugin === 'postcss-pxtransform') {
              newUse.options.postcssOptions.plugins.push(
                pxtransform({
                  platform: process.env.TARO_ENV,
                  designWidth: 750,
                  deviceRatio: {
                    640: 2.34 / 2,
                    750: 1,
                    828: 1.81 / 2,
                  },
                  selectorBlackList: [],
                })
              );
            } else {
              newUse.options.postcssOptions.plugins.push(xitem);
            }
          });
          lessRuleCfg.oneOf[0].use.push({ ...newUse });
        } else {
          lessRuleCfg.oneOf[0].use.push({ ...use });
        }
      });
      chain.module.rule('vantuiLess').merge(lessRuleCfg);
      lessRule.exclude.clear().add(/@antmjs[\\/]vantui/);
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    esnextModules: [/@antmjs[\\/]vantui/],
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
