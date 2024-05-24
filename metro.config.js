const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    server: {
        port: 8082,
        //rn-fetch-blob contains invalid configuration: "dependency.hooks" is not allowed. Please verify it's properly linked using "npx react-native config"
        enhanceMiddleware: middleware => {
            return (req, res, next) => {
                if (req.url.indexOf('rn-fetch-blob') !== -1) {
                    res.end('module.exports = {}');
                } else {
                    middleware(req, res, next);
                }
            };
        }
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
