/**
 * Internal dependencies
 */
import attributes from './attributes';
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './editor.scss';
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
const baseClass = 'wp-block-getwid-price-list';
const blockName = 'getwid/price-list';

/**
* Register the block
*/
export default registerBlockType(
    blockName,
    {
        title: __( 'Price List', 'getwid' ),
        icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect y="2" width="15" height="2"/><rect y="6" width="10" height="2"/><path d="M24,2h-2V1h-2v1l0,0c-1.1,0-2,0.9-2,2v0.99C18,6.1,18.9,7,20.01,7L22,7.01V8h-4v2h2v1h2v-1h-0.02C23.09,10,24,9.09,24,7.98	V7.01C24,5.9,23.1,5,21.99,5L20,4.99V4h4V2z"/><rect y="14" width="15" height="2"/><rect y="18" width="10" height="2"/><path d="M24,14h-2v-1h-2v1l0,0c-1.1,0-2,0.9-2,2v0.99C18,18.1,18.9,19,20.01,19L22,19.01V20h-4v2h2v1h2v-1h-0.02	c1.11,0,2.02-0.91,2.02-2.02v-0.97C24,17.9,23.1,17,21.99,17L20,16.99V16h4V14z"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
        },
        keywords: [
            __( 'price' , 'getwid' ),
            __( 'list'  , 'getwid' )
        ],
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
		deprecated: [
			{
				attributes: attributes,
				save: Save_deprecated
			}
		],
        attributes,
        transforms: {
            from: [
                {
                    type: 'block',
                    blocks: [ 'core/paragraph' ],
                    transform: content => createBlock( 'getwid/price-list',
                        {
                            title: content.content
                        }
                    )
                }
            ],
            to: [
                {
                    type: 'block',
                    blocks: [ 'core/paragraph' ],
                    transform: attributes => createBlock(
                        'core/paragraph',
                        {
                            content: attributes.title
                        }
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/testimonial' ],
                    transform: attributes => createBlock(
                        'getwid/testimonial',
                        {
                            imgId: attributes.id,
                            imgUrl: attributes.url,

                            title: attributes.title,
                            subtitle: attributes.description
                        }
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/price-box' ],
                    transform: attributes => createBlock(
                        'getwid/price-box',
                        {
                            title: attributes.title,
                            currency: attributes.currency,
                            amount: attributes.amount
                        }
                    )
                }
            ]
        },
		...checkDisableBlock(blockName, props => (
			<Edit {...{
				...props,
				baseClass
			}}/>
		)),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);
