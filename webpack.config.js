const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
		'lodash': 'lodash'
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
		editBlocksCSSPlugin
	]
};

module.exports = config;












// const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// // Set different CSS extraction for editor only and common block styles
// const blocksCSSPlugin = new ExtractTextPlugin({
// 	filename: (getPath) => {
// 		return getPath('[name].css').split('/').slice(0, -1).join('/') + '/css/style.css';
//     },
//     allChunks: false
// 	// filename: './assets/css/blocks.style.css'
// });
// const editBlocksCSSPlugin = new ExtractTextPlugin({
// 	filename: (getPath) => {
		

// 		console.log('++++++++++++++++');
// 		console.warn(getPath);
// 		console.log(getPath('assets/css/[name].css'));
// 		console.log(getPath('[name]'));
// 		console.warn(getPath('[name].css').split('/').slice(0, -1).join('/') + '/css/style.css');
// 		console.log('-------------');
// 		return getPath('[name].css').split('/').slice(0, -1).join('/') + '/css/editor.css';
//       // return getPath('assets/css/[name].css');
//     },
//     allChunks: false
// 	// filename: './assets/css/blocks.editor.css'
// });

// // Configuration for the ExtractTextPlugin.
// const extractConfig = {
// 	use: [
// 		{
// 			loader: 'raw-loader'
// 		},
// 		{
// 			loader: 'postcss-loader',
// 			options: {
// 				plugins: [require('autoprefixer')]
// 			}
// 		},
// 		{
// 			loader: 'sass-loader',
// 			query: {
// 				outputStyle:
// 					'production' === process.env.NODE_ENV ? 'compressed' : 'nested'
// 			}
// 		}
// 	]
// };

// const blocks_arr = [
// 	'icon'
// ];

// const block_obj = {};
// blocks_arr.forEach(function(block_name) {
// 	block_obj['./src/blocks/'+block_name+'/block'] = './src/blocks/'+block_name+'/index.js';
// });

// const config = {
// 	entry : block_obj,
// /*	entry: {
// 		'./src/blocks/icon/block': './src/blocks/icon/index.js',
// 		// './assets/js/editor.blocks': './src/index.js',
// 		// './assets/js/frontend.blocks': './src/frontend.js'
// 	},*/

// 	entry: {
// 		'./src/blocks/icon/block': './src/blocks/icon/index.js',
// 		'./src/blocks/icon/css/style.css': './src/blocks/icon/scss/style.scss',
// 		'./src/blocks/icon/css/editor.css': './src/blocks/icon/scss/editor.scss',





// 		// './assets/js/editor.blocks': './src/index.js',
// 		// './assets/js/frontend.blocks': './src/frontend.js'
// 	},	
// 	output: {
// 		path: path.resolve(__dirname),
// 		filename: '[name].js'
// 	},
// 	devtool: 'production' !== process.env.NODE_ENV ? 'cheap-eval-source-map' : false,
// 	watch: 'production' !== process.env.NODE_ENV,
// 	module: {
// 		rules: [
// 			{
// 				test: /\.js$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader'
// 				}
// 			},
// /*			{
// 			    test: /\.scss$/,
// 			    use: [
// 			        {
// 			            loader: 'file-loader',
// 			            options: {
// 			                name: '[name].css',
// 			                context: './src/css/',
// 			                // getPath('[name].css').split('/').slice(0, -1).join('/') + '/css/[name].css';
// 			                outputPath: '[name]',
// 			                // outputPath: 'css/',
// 			                publicPath: '../'
// 			            }
// 			        },
// 			        {
// 			            loader: 'extract-loader'
// 			        },
// 			        {
// 			            loader: 'css-loader',
// 			            options: {
// 			                sourceMap: true
// 			            }
// 			        },

// 			        {
// 			            loader: 'sass-loader',
// 			            options: {
// 			                sourceMap: true
// 			            }
// 			        }
// 			    ]
// 			}*/			
// 			{
// 				test: /style\.s?css$/,
// 				// use: [ 'file-loader?name=[name]1.css', 'extract-loader', 'css-loader', 'sass-loader' ]
// 				use: blocksCSSPlugin.extract(extractConfig)
// 			},
// 			{
// 				test: /editor\.s?css$/,
// 				// use: [ 'file-loader?name=[name]2.css', 'extract-loader', 'css-loader', 'sass-loader' ]
// 				use: editBlocksCSSPlugin.extract(extractConfig)
// 			},
// 		]
// 	},
// 	externals: {
// 		'react': 'React',
// 		'react-dom': 'ReactDOM',
// 		'lodash': 'lodash'
// 	},
// 	resolve: {
// 		alias: {
// 			GetwidControls: path.resolve(__dirname, 'src/controls/'),
// 			GetwidUtils: path.resolve(__dirname, 'src/utils/'),
// 		}
// 	},
// 	plugins: [
// 		blocksCSSPlugin,
// 		editBlocksCSSPlugin
// 	]
// };

// module.exports = config;