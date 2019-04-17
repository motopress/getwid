/* const wpExternals = [
    'blocks',
    'components',
    'date',
    'editor',
    'element',
    'i18n',
    'utils',
    'data',
    'hooks',
];


const externals = (function(){
    let ret = {};
    wpExternals.forEach(name => {
        ret['@wp/${name}'] = {root: ["wp", name]};
        ret['@wordpress/${name}'] = {root: ["wp", name]};
    });
    return ret;
})(); */








const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');

// Set different CSS extraction for editor only and common block styles
const blocksCSSPlugin = new ExtractTextPlugin({
	filename: './assets/css/blocks.style.css'
});
const editBlocksCSSPlugin = new ExtractTextPlugin({
	filename: './assets/css/blocks.editor.css'
});

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
		filename: '[name].js'
	},
	//Fix exclude "__("" from replace in minimization JS
	optimization: {
		namedModules: false,
		namedChunks: false,		
		minimizer: [
			new uglify({
			parallel: true,
			sourceMap: true,
			uglifyOptions: {
				output: {
					comments: true,
					beautify: true,
				},
				compress: {
					unsafe: false,
					inline: false,
					passes: 2,
					keep_fargs: false,
				},
				mangle: {
					reserved: ['__']
				}
			}
			})
		]
	},
/* 	optimization: {
		minimizer: [
			new uglify({
			parallel: true,
			uglifyOptions: {
				output: {
					comments: false,
					beautify: false,
				},
				compress: {
					unsafe: true,
					inline: true,
				},
				mangle: {
					reserved: ['__']
				}
			}
			})
		]
	}, */
	devtool: 'production' !== process.env.NODE_ENV ? 'cheap-eval-source-map' : false,
	watch: 'production' !== process.env.NODE_ENV,
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
			},
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'lodash': 'lodash',
		// 'wordpress/i18n': '@wordpress/i18n',
		// '@wordpress/i18n': { this: [ 'wp', 'i18n' ] }

	/* 	'@wp/i18n': { root: [ 'wp', 'i18n' ] },
		'@wordpress/i18n': { root: [ 'wp', 'i18n' ] },
		'__': { root: [ 'wp', 'i18n', '__' ] }, */
		/* 'wp.i18n': {
			window: ['wp', 'i18n'],
		},	 */	

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
	]
};

module.exports = config;
