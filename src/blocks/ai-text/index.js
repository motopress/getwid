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
const { registerBlockType } = wp.blocks;

/**
* Register the block
*/

export default registerBlockType(
	'getwid/ai-text',
	{
		title: __( 'AI Assistant (Beta)', 'getwid' ),
		category: 'getwid-blocks',
		icon: <Icon/>,
		keywords: [ 'ai' ],
		description: __( 'This Getwid block utilizes the power of AI to automate content generation and modification.', 'getwid' ),
		supports: {
            customClassName: false,
			inserter: !Getwid.disabled_blocks.includes( 'getwid/ai-text' )
		},
		attributes: {
			prompt: {
				type: 'string',
			}
		},
		...checkDisableBlock( 'getwid/ai-text', props => (
            <Edit { ...props } />
        ) ),
		save: props => {
			return null;
		}
	}
);
