const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	...defaultConfig,
	entry: {
		components: path.resolve( __dirname, 'src/components/index.ts' ),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'assets/components' ),
		filename: 'index.js',
		library: {
			name: 'GetwidComponents',
			type: 'window',
		},
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			GetwidVendor: path.resolve(__dirname, 'vendors'),
		},
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				!( plugin instanceof CopyWebpackPlugin ) &&
				!( plugin instanceof MiniCssExtractPlugin ) &&
				plugin.constructor.name !== 'RtlCssPlugin'
		),
		new MiniCssExtractPlugin( {
			filename: 'index.css',
		} )
	]
};
