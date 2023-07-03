/**
* Internal dependencies
*/
import Edit from './edit';
import { checkDisableBlock } from 'GetwidUtils/help-functions';
import './editor.scss';
import { AI as Icon } from './icons';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const { registerBlockType, createBlock } = wp.blocks;

/**
* Register the block
*/

export default registerBlockType(
	'getwid/ai',
	{
		title: __( 'AI Assistant (Beta)', 'getwid' ),
		category: 'getwid-blocks',
		icon: <Icon/>,
		keywords: [ 'ai' ],
		description: __( 'This block offers automated content generation and modification capabilities, fueled by the power of AI.', 'getwid' ),
		supports: {
            customClassName: false,
			inserter: !Getwid.disabled_blocks.includes( 'getwid/ai' )
		},
		attributes: {
			prompt: {
				type: 'string',
			}
		},
		...checkDisableBlock( 'getwid/ai', props => (
            <Edit { ...props } />
        ) ),
		save: props => {
			return null;
		}
	}
);
