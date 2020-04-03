/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-progress-bar';
const blockName = 'getwid/progress-bar';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/progress-bar',
    {
        title: __( 'Progress Bar', 'getwid' ),
        icon: <svg x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M13,14H0v6h13h11v-6H13z M22,18H12v-2h10V18z"/></g><path d="M12,12l4-2V4H8v6 M14,9l-2,1l-2-1V6h4V9z"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes,
        transforms: {
            to: [
                {
                    type: 'block',
                    blocks: [ 'getwid/counter' ],
                    transform: attributes => createBlock(
                        'getwid/counter',
                        {
                            end: attributes.fillAmount
                        }
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/circle-progress-bar' ],
                    transform: attributes => createBlock(
                        'getwid/circle-progress-bar',
                        {
                            fillAmount: attributes.fillAmount
                        }
                    )
                }
            ]
		},
		...checkDisableBlock(blockName, props => (
			<Edit {...{
				...props,
				baseClass
			}} />
		)),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);
