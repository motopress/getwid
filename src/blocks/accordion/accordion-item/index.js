/**
 * Internal dependencies
 */
import AccordionItem from './edit';
import attributes from './attributes';
import Save from './save';
import { Consumer } from '../accordion/edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Register the block
*/
export default registerBlockType(
    'getwid/accordion-item',
    {
        title: __( 'Accordion Item', 'getwid' ),
        category: 'getwid-blocks',
        parent: [ 'getwid/accordion' ],
        supports: {
            multiple: true,
            reusable: false,
            html: false
		},
        attributes,
        edit: props => (
            <Consumer>
                { () => (
                    <AccordionItem { ...props } />
                ) }
            </Consumer>
        ),
        save: props => (
            <Save { ...props } />
        )
    }
);