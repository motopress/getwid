/**
 * Internal dependencies
 */
import GetwidField         from '../contact-form/components/getwid-field';
import GetwidSubscribeForm from './edit';

import './editor.scss';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import { registerBlock } from 'GetwidUtils/register-getwid-block';

const { InnerBlocks } = wp.editor;
const { getBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const mainBlock = 'mailchimp';
const baseClass = 'wp-block-getwid-mailchimp';

const settings = {
    title: __( 'Mailchimp', 'getwid' ),
    category: 'getwid-blocks',
    //icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="9,0 0,0 0,2 9,2 9,0 " /><polygon points="9,4 0,4 0,6 9,6 9,4 " /><polygon points="9,8 0,8 0,10 9,10 9,8 " /><path d="M22,14v8H2v-8H22 M24,12H0v12h24V12L24,12z" /><path d="M11,0v10h13V0H11z M20.18,2L17.5,4.11L14.82,2H20.18z M13,8V3.11l4.5,3.55L22,3.11V8H13z" /></svg>,
    supports: {
        align: [ 'wide', 'full' ],
        reusable: false,
        html: false
    },
    keywords: [
        __( 'email'    , 'getwid' ),
        __( 'subscribe', 'getwid' ),
    ],
    getEditWrapperProps( attributes ) {
        const { align } = attributes;
        if ( [ 'wide', 'full' ].includes( align ) ) {
            return { 'data-align': align };
        }
    },
    attributes: {
        align: {
            type: 'string'
        },
        backgroundColor: {
            type: 'string'
        },
        textColor: {
            type: 'string'
        },
        customBackgroundColor: {
            type: 'string'
        },
        customTextColor: {
            type: 'string'
        },
        text: {
            type: 'string',
            default: 'Subscribe'
        },
        ids: {
            type: 'array',
            default: []
        }
    },
    edit: props => (
        <GetwidSubscribeForm {...{
            ...props,
            baseClass
        }} />
    ),
    save: () => (
        <InnerBlocks.Content/>
    )
};

const fieldDefaults = {
	category: 'getwid-blocks',
	parent: [ 'getwid/mailchimp' ],
	supports: {
        multiple: false,
        reusable: false,
        html: false
	},
	attributes: {
		label: {
			type: 'string',
			default: null
		},
		required: {
			type: 'boolean',
			default: false
		},
		placeholder: {
			type: 'string',
			default: ''
        },
        name: {
            type: 'string',
            default: ''
        },
		id: {
            type: 'string',
            default: ''
		}
    },
	save: () => null
};

const getFieldLabel = ( { attributes, name: blockName } ) => {
    return null === attributes.label ? getBlockType( blockName ).title : attributes.label;
};

const editField = (type, requiredDefault = false) => props => {
    const { className, isSelected, setAttributes } = props;

    let label = getFieldLabel( props );
    label = isEqual( label, 'Email' ) ? `${label} address` : label;
    
    return <GetwidField {...{
            ...props.attributes,
            requiredDefault,
            setAttributes,
            isSelected,
            className,
            label,
            type
        }}
	/>
};

const childBlocks = [
    {
		name: `${mainBlock}-field-email`,
		settings: {
			...fieldDefaults,
			title: __( 'Email', 'getwid' ),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /> </svg>,
			edit: editField( 'email', true )
		}
    },
	{
        name: `${mainBlock}-field-first-name`,
        settings: {
            ...fieldDefaults,
            title: __( 'First name', 'getwid' ),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> </svg>,
            edit: editField( 'text' )
        }
    },
    {
        name: `${mainBlock}-field-last-name`,
		settings: {
            ...fieldDefaults,
            title: __( 'Last name', 'getwid' ),
			icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> </svg>,
            edit: editField( 'text' )
		}
    }
];

/**
* Register the block
*/
registerBlock( 'mailchimp', settings, childBlocks );