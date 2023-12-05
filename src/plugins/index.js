/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const { PluginMoreMenuItem } = wp.editPost || wp.editSite || {};
const { addQueryArgs } = wp.url;
const { registerPlugin } = wp.plugins;


/**
* Register menu item
*/
registerPlugin( 'getwid-templates', {
	render() {

		const href = addQueryArgs("edit.php",{
			post_type: Getwid.templates.name
		});

		return PluginMoreMenuItem && (
			<PluginMoreMenuItem
				icon='category'
				href={ href }
				onClick={ () => {} }
			>
				{ __('Getwid Post Templates', 'getwid') }
			</PluginMoreMenuItem>
		);
	},
} );
