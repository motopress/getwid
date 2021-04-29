const path = require( 'path' );
const glob = require( 'glob' );

const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{
			loader: 'raw-loader'
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [ require( 'autoprefixer' ) ]
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

const blocksCSS = new ExtractTextPlugin( {
	filename: '[name]/style.css'
} );
const editBlocksCSS = new ExtractTextPlugin( {
	filename: '[name]/editor.css'
} );

const excludedFiles = ['./src/blocks/template-parts/index.js'];
const editorFiles = glob.sync('./src/blocks/*/index.js').concat(glob.sync('./src/blocks/template-parts/*/index.js'));
const editorEntries = editorFiles.filter(item => !excludedFiles.includes(item));

const editorEntry = editorEntries.reduce((entries, item) => {
	const name = item
		.replace('/index.js', '')
		.replace('./src/blocks/', '');

	entries[name] = item;
	return entries;
}, {});

const buildSeparateFiles = {
	// entry: './assets/js/editor.blocks'  : './src/index.js',
	entry: editorEntry,
	output: {
		path: path.resolve(__dirname, 'assets/blocks'),
		filename: '[name]/editor.js',
		library: [ 'wp', '[name]' ],
		libraryTarget: 'window',
	},
	devtool: 'production' !== process.env.NODE_ENV ? 'cheap-eval-source-map' : false,
	watch  : 'production' !== process.env.NODE_ENV,
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
				use: blocksCSS.extract( extractConfig )
			},
			{
				test: /editor\.s?css$/,
				use: editBlocksCSS.extract( extractConfig )
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'lodash': 'lodash',
		//https://www.cssigniter.com/importing-gutenberg-core-wordpress-libraries-es-modules-blocks/
		'wp.i18n': {
			window: [ 'wp', 'i18n' ]
		},
	},
	resolve: {
		alias: {
			GetwidControls: path.resolve( __dirname, 'src/controls/' ),
			GetwidUtils   : path.resolve( __dirname, 'src/utils/'    ),
			GetwidVendor  : path.resolve( __dirname, 'vendors/'      )
		}
	},
	plugins: [
		blocksCSS,
		editBlocksCSS
	]
};

const extractCommonStyles = new ExtractTextPlugin('common.style.css');
const extractCommonEditorStyles = new ExtractTextPlugin('common.editor.css');

const frontendFiles = glob.sync('./src/frontend/blocks/*/index.js');
const frontendEntry = frontendFiles.reduce((entries, item) => {
	const name = item
		.replace('/index.js', '/frontend.js')
		.replace('./src/frontend/blocks/', '');

	entries[name] = item;
	return entries;
}, {});

const buildFrontendSeparateFiles = {
	entry: {
		...frontendEntry,
		'common.style.css': './src/style.scss',
		'common.editor.css': './src/editor.scss',
	},
	output: {
		path: path.resolve(__dirname, 'assets/blocks'),
		filename: '[name]',
		library: [ 'wp', '[name]' ],
		libraryTarget: 'window',
	},
	devtool: 'production' !== process.env.NODE_ENV ? 'cheap-eval-source-map' : false,
	watch  : 'production' !== process.env.NODE_ENV,
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
				use: extractCommonStyles.extract(extractConfig)
			},
			{
				test: /editor\.s?css$/,
				use: extractCommonEditorStyles.extract(extractConfig)
			}
		]
	},
	resolve: {
		alias: {
			GetwidControls: path.resolve( __dirname, 'src/controls/' ),
			GetwidUtils   : path.resolve( __dirname, 'src/utils/'    ),
			GetwidVendor  : path.resolve( __dirname, 'vendors/'      )
		}
	},
	plugins: [
		extractCommonStyles,
		extractCommonEditorStyles,
	]
};

module.exports = [buildSeparateFiles, buildFrontendSeparateFiles];
