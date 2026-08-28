import {
	registerBlockType,
	type BlockConfiguration,
	type BlockSettings,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import Edit from './edit';
import ButtonGroupIcon from './icon';
import metadata from './block.json';
import Save from './save';
import { transforms } from './transforms';
import type { ButtonGroupAttributes } from './types';

const blockName = 'getwid/button-group';

type HooksApi = {
	addFilter: (
		hookName: string,
		namespace: string,
		callback: ( settings: BlockSettings, name: string ) => BlockSettings
	) => void;
};

function allowButtonAsChild(
	settings: BlockSettings,
	name: string
): BlockSettings {
	if ( name !== 'core/button' ) {
		return settings;
	}

	return {
		...settings,
		parent: [ ...( settings.parent || [] ), blockName ],
	};
}

const hooks = (
	window as Window & {
		wp: {
			hooks: HooksApi;
		};
	}
 ).wp.hooks;

hooks.addFilter(
	'blocks.registerBlockType',
	'getwid/button-group/core-button-settings',
	allowButtonAsChild
);

registerBlockType( metadata as BlockConfiguration< ButtonGroupAttributes >, {
	title: __( 'Button Group', 'getwid' ),
	icon: <ButtonGroupIcon />,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
