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
	title: __('Getwid Toggle', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		src: 'menu',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('toggle', 'getwid'),
		__('getwid', 'getwid'),
	],

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

		console.warn(props);

		return (
			<div className={classnames(baseClass, {
				'wp-block-getwid-toggle--icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
			>
				{titles.map((item, index) => (
		
					<div className="wp-block-getwid-toggle__row">
						<div className="wp-block-getwid-toggle__header">
							<RichText.Content tagName={headerTag} className='wp-block-getwid-toggle__header-title' value={item.content}/>
							<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--active"><Dashicon icon="plus"/></span>
							<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--passive"><Dashicon icon="minus"/></span>							
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