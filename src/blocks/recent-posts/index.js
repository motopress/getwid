import classnames from 'classnames';
import edit from './edit';

import './style.scss'

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/recent-posts', {
	title: __('Recent Posts', 'getwid'),
	icon: {
		foreground: '#bf3737',		
		src: 'star-filled',
	},
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'left', 'center', 'right', 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return null;
	},
} );