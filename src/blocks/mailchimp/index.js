/**
 * Internal dependencies
 */
import GetwidField         from '../contact-form/components/getwid-field';
import GetwidSubscribeForm from './edit';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual } from 'lodash';
import { registerBlock } from 'GetwidUtils/register-getwid-block';

const { InnerBlocks } = wp.blockEditor || wp.editor;
const { getBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const mainBlock = 'mailchimp';
const baseClass = 'wp-block-getwid-mailchimp';
const blockName = 'getwid/mailchimp';

const settings = {
    title: __( 'Mailchimp', 'getwid' ),
    category: 'getwid-blocks',
    icon: <svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.41,15.65c-0.14-0.34-0.48-0.58-0.87-0.68C22.4,14.34,22.2,14.05,22.2,14c0.05-0.1,0.14-0.14,0.14-0.19  c0.58-0.68,0.19-1.69-0.77-1.93c-0.53-0.53-1.01-0.77-1.45-0.97c-0.39-0.19-0.24-0.1-0.58-0.29c-0.1-0.48-0.14-1.55-0.29-2.32  c-0.14-0.68-0.43-1.21-0.82-1.5c-0.19-0.39-0.39-0.72-0.68-1.01c1.35-2.03,1.69-4.06,0.72-5.12C18.05,0.19,17.43,0,16.65,0  c-1.11,0-2.41,0.43-3.77,1.26c0,0-0.87-0.72-0.92-0.72C8.2-2.41-2.47,10.67,1.3,13.52l0.97,0.72c-0.63,1.69,0.24,3.72,2.03,4.35  c0.39,0.14,0.82,0.19,1.26,0.19c0,0,2.85,5.22,8.89,5.22c6.95,0,8.74-6.81,8.74-6.86C23.12,17.19,23.7,16.32,23.41,15.65z   M1.54,12.65c-0.72-1.3,0.58-3.91,1.55-5.46C5.4,3.48,9.31,0.53,11.1,0.97l0.48-0.19c0,0,1.3,1.11,1.35,1.11  c0.92-0.53,2.08-1.11,3.14-1.21c-0.68,0.14-1.45,0.48-2.41,1.06c0,0-2.27,1.55-3.62,2.9c-0.72,0.72-3.72,4.35-3.72,4.3  c0.53-1.01,0.92-1.55,1.79-2.61C8.59,5.7,9.12,5.12,9.65,4.54c0.24-0.24,0.48-0.48,0.77-0.72c0.19-0.14,0.34-0.34,0.53-0.48  c0.1-0.05,0.14-0.14,0.24-0.19l0,0L9.46,1.69l0.1,0.63l1.26,1.11c0,0-1.11,0.77-1.69,1.26c-2.27,1.93-4.44,4.88-5.26,7.73H3.9  C3.51,12.66,3.08,13,2.74,13.48C2.6,13.52,1.68,12.89,1.54,12.65z M5.26,18.01c-1.35,0-2.41-1.16-2.41-2.56s1.11-2.56,2.41-2.56  c0.34,0,0.68,0.1,0.97,0.19c0,0,0.53,0.24,0.68,1.5l0,0l0,0c0.14-0.39,0.24-0.72,0.24-0.72c0.19,0.53,0.24,1.11,0.24,1.64l0,0l0,0  c0.14-0.19,0.29-0.53,0.29-0.53C7.96,16.61,6.8,18.01,5.26,18.01z M8.25,8.98L8.25,8.98c0,0,1.06-1.98,3.33-3.33  C11.39,5.6,11,5.7,10.91,5.7c0.43-0.34,1.21-0.58,1.74-0.72c-0.14-0.1-0.53-0.14-0.72-0.14c-0.05,0-0.05,0-0.1,0  c0.48-0.29,1.45-0.43,2.27-0.29c-0.1-0.16-0.34-0.25-0.54-0.3h-0.1h0.05c0.53-0.1,1.11,0,1.59,0.19c-0.05-0.14-0.19-0.29-0.29-0.39  L14.76,4c0.48,0.1,0.97,0.34,1.35,0.58c-0.05-0.1-0.14-0.24-0.24-0.34c0.48,0.14,1.01,0.48,1.26,0.97l0,0v0.05l0,0  C16.22,4.59,13.61,4.78,11,6.47C9.84,7.24,8.93,8.06,8.25,8.98z M22.45,16.85c-0.05,0.05-0.34,1.84-2.27,3.33  c-2.37,1.88-5.51,1.69-6.71,0.63c-0.63-0.58-0.92-1.45-0.92-1.45s-0.05,0.48-0.1,0.68c-0.48-0.82-0.43-1.79-0.43-1.79  s-0.24,0.48-0.39,0.72c-0.34-0.92-0.19-1.84-0.19-1.84l-0.29,0.43c0,0-0.14-1.01,0.19-1.84c0.34-0.92,1.01-1.55,1.16-1.64  c-0.48-0.14-1.06-0.63-1.06-0.63s0.24,0,0.39,0c0,0-1.01-0.72-1.21-1.84C10.76,11.8,11.05,12,11.05,12  c-0.1-0.29-0.14-0.92-0.05-1.59l0,0c0.19-1.21,1.21-2.03,2.32-2.03c1.21,0,2.03,0.24,3.04-0.68c0.19-0.19,0.39-0.39,0.68-0.43  c0.05,0,0.1-0.05,0.29-0.05c0.14,0,0.34,0.05,0.48,0.14c0.53,0.34,0.68,1.21,0.72,1.84c0.24,2.32,0.14,1.93,1.06,2.41  c0.43,0.24,0.97,0.43,1.55,1.06l0,0l0,0c0.48,0,0.72,0.39,0.53,0.68c-1.64,1.93-3.91,2.85-6.42,2.95c-0.1,0-0.34,0-0.34,0  c-1.01,0.05-1.35,1.35-0.72,2.12c0.39,0.48,1.21,0.68,1.84,0.68l0,0c2.75,0.05,5.55-1.88,6.04-2.99l0.05-0.1  c-0.1,0.14-2.8,2.66-6.08,2.56c0,0-0.34,0-0.68-0.1c-0.43-0.1-0.77-0.29-0.92-0.72c0.29,0.05,0.63,0.1,1.01,0.1  c2.37,0,4.06-1.06,3.91-1.11c0,0,0,0-0.05,0c-0.29,0.05-3.14,1.16-4.93,0.58c0-0.05,0-0.1,0.05-0.14c0.14-0.53,0.43-0.48,0.92-0.48  l0,0c1.64-0.05,2.95-0.48,3.96-0.92c1.06-0.48,1.88-1.16,2.17-1.5c0.39,0.63,0.39,1.45,0.39,1.45s0.14-0.05,0.34-0.05  C22.79,15.74,22.88,16.27,22.45,16.85z" />
        <polygon points="11,1.84 11.34,1.93 11.05,0.97 10.91,1.45 " />
        <path d="M12.45,2.17l-0.53-0.43l0.19,0.68C12.21,2.32,12.31,2.27,12.45,2.17z" />
        <path d="M17.33,10.82c0.29,0,0.53,0.05,0.77,0.14c0-0.68-0.39-1.4-0.68-1.3l0,0l0,0l0,0c-0.19,0.05-0.19,0.34-0.19,0.53  C17.23,10.43,17.23,10.62,17.33,10.82z" />
        <path d="M11.87,2.56l-1.11-0.34l0.72,0.63C11.63,2.75,11.73,2.66,11.87,2.56z" />
        <path d="M14.72,11.78c0.24,0.1,0.39,0.14,0.39,0.1c0,0,0-0.1-0.05-0.14c-0.14-0.19-0.39-0.39-0.63-0.43  c-0.53-0.19-1.16-0.1-1.59,0.29c-0.24,0.19-0.34,0.39-0.24,0.39c0.05,0,0.19-0.05,0.39-0.1C13.76,11.54,14.14,11.54,14.72,11.78z" />
        <path d="M14.77,12.41c0.14,0,0.24,0,0.24,0c0.05-0.1-0.29-0.34-0.82-0.29c-0.05,0-0.1,0.05-0.19,0.05h-0.05  c-0.1,0.05-0.24,0.1-0.34,0.19c-0.1,0.1-0.14,0.19-0.1,0.24c0.05,0.05,0.1,0,0.24-0.05C14.19,12.41,14.48,12.41,14.77,12.41z" />
        <path d="M6.13,14.58c0.14,0.19,0.1,0.29,0.14,0.34c0,0,0.05,0.05,0.1,0c0.1-0.05,0.1-0.14,0.1-0.24l0,0l0,0l0,0  c0-0.19-0.1-0.43-0.24-0.58l0,0l0,0c-0.19-0.19-0.43-0.39-0.77-0.43c-0.29-0.05-0.58,0-0.63,0.05l0,0c-0.05,0-0.1,0-0.14,0.05  c-0.77,0.29-1.11,1.06-0.97,1.79c0.05,0.19,0.14,0.39,0.24,0.53l0,0l0,0l0,0c0.14,0.19,0.34,0.14,0.24,0c0-0.05-0.1-0.24-0.14-0.53  c0-0.34,0.05-0.68,0.29-0.97c0.14-0.19,0.34-0.29,0.39-0.29l0,0c0.05,0,0.05-0.05,0.1-0.05h0.05c0.1-0.05,0.05,0,0.14-0.05l0,0  C5.6,14.1,5.98,14.34,6.13,14.58z" />
        <path d="M5.88,15.16c-0.05-0.05-0.1-0.1-0.1-0.14c0-0.1,0-0.14,0.1-0.19c0.05-0.05,0.1-0.05,0.1-0.1s-0.19-0.1-0.39,0.05  c-0.14,0.14-0.14,0.43,0.05,0.63c0.24,0.24,0.58,0.29,0.63,0.58c0,0.05,0,0.1,0,0.14c0,0.05,0,0.14,0,0.14  c-0.05,0.29-0.34,0.58-0.82,0.48c-0.1,0-0.14,0-0.14,0C5.26,16.8,5.45,17.05,5.84,17c0.53,0,0.92-0.53,0.82-1.11  C6.61,15.4,6.08,15.31,5.88,15.16z" />
        <ellipse transform="matrix(0.1541 -0.9881 0.9881 0.1541 3.5429 27.9174)" cx="18.08" cy="11.89" rx="0.34" ry="0.24" />
        <ellipse transform="matrix(0.4806 -0.877 0.877 0.4806 -1.9651 21.2287)" cx="16.94" cy="12.27" rx="0.29" ry="0.39" />
    </svg>,
    supports: {
        align: [ 'wide', 'full' ],
        reusable: false,
		html: false,
		inserter: !Getwid.disabled_blocks.includes(blockName)
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
	...checkDisableBlock(blockName, props => (
        <GetwidSubscribeForm {...{
            ...props,
            baseClass
        }} />
	)),
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
			title: __( 'Email address', 'getwid' ),
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
