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
				active
			}
		} = props;

		return (
			<div className={classnames(baseClass, {
				'wp-block-getwid-toggle--icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
			>
				{titles.map((item, index) => (
		
					<div className="wp-block-getwid-toggle__row">
						<div className="wp-block-getwid-toggle__header">
							<h3>
								<RichText.Content value={item.content}/>
							</h3>
							<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--active"><i className="fas fa-plus"></i></span>
							<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--passive"><i className="fas fa-minus"></i></span>							
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