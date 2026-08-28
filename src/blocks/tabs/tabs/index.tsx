import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import { deprecated } from './deprecated';
import Edit from './edit';
import TabsIcon from './icon';
import Save from './save';
import { transforms } from './transforms';
import type { TabsAttributes } from './types';

const blockName = 'getwid/tabs';

registerBlockType( metadata as BlockConfiguration< TabsAttributes >, {
	title: __( 'Tabs', 'getwid' ),
	icon: <TabsIcon />,
	deprecated,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
