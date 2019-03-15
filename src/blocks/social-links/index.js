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

const baseClass = 'wp-block-getwid-social-links';

// Register the block
registerBlockType('getwid/social-links', {
	title: __('Tabs', 'getwid'),
	// icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,2H10V0H0V24H24V2ZM10,4h5V6H10ZM22,22H2V2H8V8H22ZM22,6H17V4h5Z"/></svg>,
	icon: {
		src: 'admin-settings',
		foreground: '#bf3737',
	},
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes: attributes,
	edit,
	save: props => {

		const {
			attributes: {
				align,
				textAlign,
				icons,
				iconsColor,
				iconsSize,
				iconsSpacing,
			}
		} = props;

		// const Tag = headerTag;

	/* 	return (
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
		); */

		return (<div>SAVE</div>);
	},
});