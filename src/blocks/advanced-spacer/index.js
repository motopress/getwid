import edit from './edit';
import save from './save.js';
import attributes from './attributes';

const { __ } = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;

export default registerBlockType(
	'getwid/advanced-spacer',
	{
		title: __('Advancer spacer', 'getwid'),
		category: 'getwid-blocks',		
		attributes,
		save,
        edit,
	}
);