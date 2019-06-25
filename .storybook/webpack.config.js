module.exports = (baseConfig, env, defaultConfig) => ({
    ...defaultConfig,
    module: {
        ...defaultConfig.module,
        rules: [
            // Temp fix for issue: https://github.com/storybooks/storybook/issues/3346
            ...defaultConfig.module.rules.filter(rule => !(
                (rule.use && rule.use.length && rule.use.find(({ loader }) => loader === 'babel-loader'))
            )),
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ],
    },
});
