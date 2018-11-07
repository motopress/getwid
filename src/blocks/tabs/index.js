import classnames from 'classnames';

import './style.scss'

import attributes from './attributes';
import edit from './edit';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	RichText
} = wp.editor;

const baseClass = 'wp-block-getwid-tabs';

// Register the block
registerBlockType('getwid/tabs', {
	title: __('Getwid Tabs', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: 'editor-table',
	category: 'layout',
	keywords: [
		__('tabs', 'getwid'),
		__('getwid', 'getwid'),
	],

	attributes: attributes,

	edit,

	save: props => {

		const {
			attributes: {
				titles,
				items,
				type,
				active
			}
		} = props;

		return (
			<div
				className={classnames(baseClass, {
					'wp-block-getwid-tabs--vertical': type === 'vertical'
				})}
				data-active-tab={active}
			>
				<ul className="wp-block-getwid-tabs__nav-links">
					{titles.map((item, index) => (
						<li className="wp-block-getwid-tabs__nav-link" key={index}>
							<a href={`#tab-${index}`}>
								<RichText.Content value={item.content}/>
							</a>
						</li>
					))}
				</ul>
				{items.map((item, index) => (
					<div id={`tab-${index}`} className="wp-block-getwid-tabs__tab-content" key={index}>
						<RichText.Content value={item.content}/>
					</div>
				))}
			</div>
		);
	},
});