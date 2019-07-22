const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* #region include new plugin */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* #endregion */

// Set different CSS extraction for editor only and common block styles
const blocksCSSPlugin = new ExtractTextPlugin({
	filename: './assets/css/blocks.style.css'
});
const editBlocksCSSPlugin = new ExtractTextPlugin({
	filename: './assets/css/blocks.editor.css'
});

/* #region create instance */
const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
	analyzerMode: 'server',
	generateStatsFile: true,
	statsOptions: { source: false }
});
/* #endregion */

// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{
			loader: 'raw-loader'
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [require('autoprefixer')]
			}
		},
		{
			loader: 'sass-loader',
			query: {
				outputStyle:
					'production' === process.env.NODE_ENV ? 'compressed' : 'nested'
			}
		}
	]
};

const config = {
	entry: {
		'./assets/js/editor.blocks': './src/index.js',
		'./assets/js/frontend.blocks': './src/frontend.js'
	},
	output: {
		path: path.resolve(__dirname),
		filename: '[name].js',
		library: ['wp', '[name]'],
		libraryTarget: 'window',
	},
	devtool: 'production' !== process.env.NODE_ENV ? 'cheap-eval-source-map' : false,
	watch: 'production' !== process.env.NODE_ENV,
	stats: { children: false },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /style\.s?css$/,
				use: blocksCSSPlugin.extract(extractConfig)
			},
			{
				test: /editor\.s?css$/,
				use: editBlocksCSSPlugin.extract(extractConfig)
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'lodash': 'lodash',
		//https://www.cssigniter.com/importing-gutenberg-core-wordpress-libraries-es-modules-blocks/
		'wp.i18n': {
			window: ['wp', 'i18n'],
		},
	},
	resolve: {
		alias: {
			GetwidControls: path.resolve(__dirname, 'src/controls/'),
			GetwidUtils: path.resolve(__dirname, 'src/utils/'),
			GetwidVendor: path.resolve(__dirname, 'vendors/'),
		}
	},
	plugins: [
		blocksCSSPlugin,
		editBlocksCSSPlugin,
		bundleAnalyzerPlugin
	]
};

module.exports = config;
