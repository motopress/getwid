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
	title: __('Tabs', 'getwid'),
	icon: {	
		src: 'editor-table',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('getwid', 'getwid'),
	],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes: attributes,

	edit,

	save: props => {

		const {
			attributes: {
				titles,
				items,
				type,
				active,
				headerTag,
			}
		} = props;

		const Tag = headerTag;

		return (
			<div
				className={classnames(baseClass,
                    {
                        [`wp-block-getwid-tabs--${type}`]: type !== ''
                    }
				)}
				data-active-tab={active}
			>
				<ul className="wp-block-getwid-tabs__nav-links">
					{titles.map((item, index) => (
						<li className="wp-block-getwid-tabs__nav-link" key={index}>

							<Tag className='wp-block-getwid-tabs__title-wrapper'>
								<a href={`#tab-${index}`}>
									<RichText.Content tagName='span' className='wp-block-getwid-tabs__title' value={item.content}/>
								</a>
							</Tag>

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