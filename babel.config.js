module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      // Keep this plugin last
      'react-native-reanimated/plugin',
    ],
  };
};
