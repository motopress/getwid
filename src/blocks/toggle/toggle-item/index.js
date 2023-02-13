/**
 * Internal dependencies
 */
import ToggleItem from './edit';
import attributes from './attributes';
import Save from './save';
import { Consumer } from '../toggle/edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-toggle-item';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/toggle-item',
    {
        title: __( 'Toggle Item', 'getwid' ),
        category: 'getwid-blocks',
        parent: [ 'getwid/toggle' ],
        supports: {
            anchor: true,
            multiple: true,
            reusable: false,
            html: false
        },
		attributes,
		getEditWrapperProps(attributes) {
			const { active } = attributes;

			return {
				'toggle-active-default': active ? 'true' : ''
			};
		},
        edit: props => (
            <Consumer>
                {({ updateParentOptions }) => (
                    <ToggleItem {...{
                        ...props,
                        ...{updateParentOptions},
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
