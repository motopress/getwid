import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import { contactFormClass } from './constants';
import Edit from './edit';
import ContactFormIcon from './icon';
import metadata from './block.json';
import Save from './save';
import type { ContactFormAttributes } from './types';

const blockName = 'getwid/contact-form';

registerBlockType( metadata as BlockConfiguration< ContactFormAttributes >, {
	title: __( 'Contact Form', 'getwid' ),
	icon: <ContactFormIcon />,
	keywords: [ __( 'email', 'getwid' ), __( 'message', 'getwid' ) ],
	edit:
		MaybeBlockIsDisabled( blockName ) ||
		( ( props ) => (
			<Edit { ...props } contactFormClass={ contactFormClass } />
		) ),
	save: Save,
} );
