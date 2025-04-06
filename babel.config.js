module.exports = {
  presets: ['@react-native/babel-preset'],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
