import attributes from './attributes';
import Edit from './edit';

import { __ } from 'wp.i18n';

import './style.scss';

const {
	registerBlockType
} = wp.blocks;

const {
	InnerBlocks,

} = wp.editor;

const baseClass = 'wp-block-getwid-contact-form';

export default registerBlockType(
    'getwid/contact-form',
    {
        title: __('Contact Form', 'getwid'),
        category: 'getwid-blocks',
        icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="9,0 0,0 0,2 9,2 9,0 "/><polygon points="9,4 0,4 0,6 9,6 9,4 "/><polygon points="9,8 0,8 0,10 9,10 9,8 "/><path d="M22,14v8H2v-8H22 M24,12H0v12h24V12L24,12z"/><path d="M11,0v10h13V0H11z M20.18,2L17.5,4.11L14.82,2H20.18z M13,8V3.11l4.5,3.55L22,3.11V8H13z"/></svg>,
        supports: {
			align: [ 'wide', 'full' ],
		},
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes,
        edit: (props) => {
            return (
                <Edit {...{
                    ...props,
                    baseClass,
                }}/>
            )
        },
        save: () => {
            return <InnerBlocks.Content/>;
        }
    }
);