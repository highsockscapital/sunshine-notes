const isGithubRelease = false;
const config = {
  commands: require("@callstack/repack/commands/rspack")
};

if (!config.dependencies) config.dependencies = {};

if (isGithubRelease) {
  config.dependencies["react-native-iap"] = {
    platforms: {
      android: null
    }
  };
}

module.exports = config;
