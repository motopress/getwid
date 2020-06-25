/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import { checkDisableBlock } from 'GetwidUtils/help-functions';
import attributes from './attributes';
import GetwidTable from './edit';
import Save from './save';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-table';
const blockName = 'getwid/table';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/table',
    {
        title: __( 'Table', 'getwid' ),
        icon: 'editor-table',
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
        edit: props => (
            <GetwidTable {...{
                ...props,
                baseClass
            }} />
        ),
        ...checkDisableBlock(blockName, props => (
            <GetwidTable {...{
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