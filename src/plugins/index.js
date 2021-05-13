/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { createElement } = wp.element;
const { PluginMoreMenuItem } = wp.editPost;
const { addQueryArgs } = wp.url;
const { registerPlugin } = wp.plugins;


/**
* Register menu item
*/
registerPlugin( 'getwid-templates', {
	render() {

		return createElement(
			PluginMoreMenuItem,
			{
				icon: 'category',
				href: addQueryArgs("edit.php",{
					post_type: Getwid.templates.name
				}),
				onClick: function() {},
			},
			__('Getwid Post Templates', 'getwid')
		);
	},
} );
