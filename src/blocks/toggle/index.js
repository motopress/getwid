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

const {
	Dashicon
} = wp.components;

const { Fragment } = wp.element;

const baseClass = 'wp-block-getwid-toggle';

// Register the block
registerBlockType('getwid/toggle', {
	title: __('Toggle', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		src: 'menu',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('toggle', 'getwid'),
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
				iconPosition,
				active,
				headerTag
			}
		} = props;

		const Tag = headerTag;

		return (
			<div className={classnames(baseClass, {
				'wp-block-getwid-toggle--icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
			>
				{titles.map((item, index) => (
		
					<div className="wp-block-getwid-toggle__row">
						<div className="wp-block-getwid-toggle__header-wrapper">
							<Tag className='wp-block-getwid-toggle__header'>
								<a href="#">
									<RichText.Content tagName='span' className='wp-block-getwid-toggle__header-title' value={item.content}/>
									<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--active"><i className="fas fa-plus"></i></span>
									<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--passive"><i className="fas fa-minus"></i></span>	
								</a>
							</Tag>	
						</div>
						<div className="wp-block-getwid-toggle__content">
							<RichText.Content value={items[index].content}/>
						</div>
					</div>	
				))}
			</div>
		);
	},
});