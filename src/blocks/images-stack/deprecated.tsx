import metadata from './block.json';
import Save from './save';

export default [
	{
		attributes: ( metadata as { attributes: Record< string, unknown > } )
			.attributes,
		save: Save,
	},
];
