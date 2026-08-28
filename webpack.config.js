const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal: ( request ) => {
				if ( request === 'getwid-components' ) {
					return 'GetwidComponents';
				}
			},
			requestToHandle: ( request ) => {
				if ( request === 'getwid-components' ) {
					return 'getwid-components';
				}
			},
		} ),
	],
};
