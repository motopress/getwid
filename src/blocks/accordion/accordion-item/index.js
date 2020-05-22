/**
 * Internal dependencies
 */
import AccordionItem from './edit';
import attributes from './attributes';
// import Save_deprecated from './save_deprecated';

import Save from './save';

import { Consumer } from '../accordion/edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-accordion-item';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/accordion-item',
    {
        title: __( 'Accordion item', 'getwid' ),
        //icon:
        category: 'getwid-blocks',
        parent: [ 'getwid/accordion' ],
        supports: {
            multiple: true,
            reusable: false,
            html: false
        },
        // deprecated: [{
        //     attributes: attributes,
        //     save: Save_deprecated
		// }],
        attributes,
        edit: props => (
            <Consumer>
                {({ updateLineHeight }) => (
                    <AccordionItem {...{
                        ...props,
                        ...{updateLineHeight},
                        baseClass
                    }} />
                )}
            </Consumer>
        ),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);