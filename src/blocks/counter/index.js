/**
 * Internal dependencies
 */
import Save from './save';
import Save_deprecated from './save_deprecated';
import Edit from './edit';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isInViewport, scrollHandler } from 'GetwidUtils/help-functions';

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-counter';
const blockName = 'getwid/counter';

/**
* Register the block
*/
export default registerBlockType(
    blockName,
    {
        title: __( 'Counter', 'getwid' ),
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" x="0px" y="0px"><g><g><path d="M22,2v20H2V2H22 M24,0H0v24h24V0L24,0z"/></g><polygon points="7,6 7,6 7,6 3.46,9.54 4.88,10.95 7,8.83 7,18 9,18 9,6"/><polygon points="18,3 18,3 18,3 14.46,6.54 15.88,7.95 18,5.83 18,11 20,11 20,3"/><path d="M21,16c0-0.61,0.01-1.54-0.69-2.24C19.79,13.25,19.04,13,18,13c-3,0-3,2.03-3,3h2c-0.01-0.07-0.04-0.44,0.22-0.73 C17.47,15,17.83,15,18,15c0.13,0,0.52,0,0.77,0.27c0,0,0.23,0.25,0.23,0.72c-0.01,1.1-3.73,2.8-4,2.92V21h6v-2h-3 C19.25,18.41,20.99,17.17,21,16z"/><g><polygon points="14,18 13,18 13,6 14,6 14,4 11,4 11,20 14,20"/><polygon points="21,4 21,6 22,6 22,18 21,18 21,20 24,20 24,4"/></g><rect x="11" y="2" width="2" height="20"/></g><g></g></svg>,
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
        deprecated: [
            {
                attributes: attributes,
                save: (props) => {
                    return (
                        <Save_deprecated {...{
                            ...props,
                            baseClass,
                        }}/>
                    )
                }
            }
        ],
        attributes,
        transforms: {
            to: [
                {
                    type: 'block',
                    blocks: [ 'getwid/progress-bar' ],
                    transform: attributes => createBlock(
                        'getwid/progress-bar',
                        {
                            fillAmount: attributes.end
                        }
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/circle-progress-bar' ],
                    transform: attributes => createBlock(
                        'getwid/circle-progress-bar',
                        {
                            fillAmount: attributes.end
                        }
                    )
                }
            ]
		},
		...checkDisableBlock(blockName, (props) => {
            return (
                <Edit {...{
                    ...props,
                    baseClass,
                    isInViewport,
                    scrollHandler
                }}/>
            )
        }),
        save: (props) => {
            return (
                <Save {...{
                    ...props,
                    baseClass,
                }}/>
            )
        }
    }
);
