import classnames from 'classnames';
import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/advanced-heading', {
	title: __('Advanced Heading', 'getwid'),
	icon: {
		foreground: '#bf3737',
		src: 'editor-textcolor',
	},
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},	
	attributes,
	edit,
	save,
} );
