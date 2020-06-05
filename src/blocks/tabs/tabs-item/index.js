/**
 * Internal dependencies
 */
import TabItem from './edit';
import attributes from './attributes';
import Save from './save';
import { Consumer } from '../tabs/edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-tabs-item';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/tabs-item',
    {
        title: __( 'Tabs item', 'getwid' ),
        category: 'getwid-blocks',
        parent: [ 'getwid/tabs' ],
        supports: {
            multiple: true,
            reusable: false,
            html: false
		},
		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( [ 'wide', 'full' ].includes( align ) ) {
				return { 'data-align': align };
			}
		},
		attributes,
        edit: props => (
            <Consumer>
                {({ updateParentOptions, getState }) => (
                    <TabItem {...{
                        ...props,
                        ...{updateParentOptions},
                        ...{getParentState:getState},
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