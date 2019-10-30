/**
 * Internal dependencies
 */
import GetwidFieldTextarea from './components/getwid-field-textarea';
import GetwidCaptcha       from './components/getwid-captcha';
import GetwidField         from './components/getwid-field';
import GetwidContactForm   from './edit';

import './editor.scss';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual } from 'lodash';
import { registerBlock } from 'GetwidUtils/register-getwid-block';

const { InnerBlocks } = wp.blockEditor;
const { getBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const contactFormClass = 'wp-block-getwid-contact-form';
const captchaClass     = 'wp-block-getwid-captcha';

const settings = {
    title: __( 'Contact Form', 'getwid' ),
    category: 'getwid-blocks',
    icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="9,0 0,0 0,2 9,2 9,0 " /><polygon points="9,4 0,4 0,6 9,6 9,4 " /><polygon points="9,8 0,8 0,10 9,10 9,8 " /><path d="M22,14v8H2v-8H22 M24,12H0v12h24V12L24,12z" /><path d="M11,0v10h13V0H11z M20.18,2L17.5,4.11L14.82,2H20.18z M13,8V3.11l4.5,3.55L22,3.11V8H13z" /></svg>,
    supports: {
        align: [ 'wide', 'full' ],
        reusable: false,
        html: false,
    },
    keywords: [
        __( 'email'  , 'getwid' ),
        __( 'message', 'getwid' ),
    ],
    getEditWrapperProps(attributes) {
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
        subject: {
            type: 'string'
        },
        text: {
            type: 'string',
            default: 'Submit'
        },       
    },
    edit: props => (
        <GetwidContactForm {...{
            ...props,
            contactFormClass
        }} />
    ),
    save: () => (
        <InnerBlocks.Content/>
    )
};

const fieldDefaults = {
	category: 'getwid-blocks',
	parent: [ 'getwid/contact-form' ],
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

const editField = type => props => {
    const { className, isSelected, setAttributes } = props;

    let value = getFieldLabel( props );
    value = isEqual( value, 'Email' ) ? `${value} address` : value;
    
    return <GetwidField {...{
            ...props.attributes,
            label: value,
            setAttributes,
            isSelected,
            className,
            type
        }}
	/>
};

const textareaField = props => {
    const { className, isSelected, setAttributes } = props;

    return <GetwidFieldTextarea {...{
            ...props.attributes,
            label: getFieldLabel( props ),
            setAttributes,
            isSelected,
            className
        }}
    />
};

const childBlocks = [
	{
		name: 'field-name',
		settings: {
			...fieldDefaults,
			title: __( 'Name', 'getwid' ),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> </svg>,
            edit: editField( 'text' )
		}
    },
    {
		name: 'field-email',
		settings: {
			...fieldDefaults,
			title: __( 'Email', 'getwid' ),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /> </svg>,
			edit: editField( 'email' )
		}
    },
    {
		name: 'field-textarea',
		settings: {
			...fieldDefaults,
			title: __( 'Message', 'getwid' ),			
			icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z" /> </svg>,
            edit: ( props ) => (
                textareaField( props )
            )
		}
    },
    {
		name: 'captcha',
		settings: {
            parent  : fieldDefaults.parent,
            supports: fieldDefaults.supports,
            category: fieldDefaults.category,
            
			title: __( 'Captcha', 'getwid' ),
            icon: 'shield',
            attributes: {
                theme: {
                    type: 'string',
                    default: 'light'
                },
                size: {
                    type: 'string'
                }
            },
            edit: ( props ) => (
                <GetwidCaptcha {...{
                    ...props,
                    captchaClass
                }} />
            ),
            save: fieldDefaults.save
		}
	}
];

/**
* Register the block
*/
registerBlock( 'contact-form', settings, childBlocks );