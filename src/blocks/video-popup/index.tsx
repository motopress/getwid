import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import { deprecated } from './deprecated';
import Edit from './edit';
import VideoPopupIcon from './icon';
import Save from './save';
import { transforms } from './transforms';
import type { VideoPopupAttributes } from './types';

const blockName = 'getwid/video-popup';

registerBlockType( metadata as BlockConfiguration< VideoPopupAttributes >, {
	title: __( 'Video Popup', 'getwid' ),
	icon: <VideoPopupIcon />,
	deprecated,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
