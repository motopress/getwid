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

const baseClass = 'wp-block-getwid-accordion';

// Register the block
registerBlockType('getwid/accordion', {
	title: __('Getwid Accordion', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		foreground: '#bf3737',		
		src: 'menu',
	},	
	category: 'layout',
	keywords: [
		__('accordion', 'getwid'),
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
				heightStyle
			}
		} = props;

		return (
			<div className={classnames(baseClass, {
				'wp-block-getwid-accordion--icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
				data-height-style={heightStyle}
			>
				{titles.map((item, index) => (
					<Fragment>
						<div className="wp-block-getwid-accordion__header" key={'header'}>
							<h3>
								<RichText.Content value={item.content}/>
							</h3>
							<span className="wp-block-getwid-accordion__icon wp-block-getwid-accordion__icon--active"><i className="fas fa-plus"></i></span>
							<span className="wp-block-getwid-accordion__icon wp-block-getwid-accordion__icon--passive"><i className="fas fa-minus"></i></span>							
						</div>
						<div className="wp-block-getwid-accordion__content" key={'content'}>
							<RichText.Content value={items[index].content}/>
						</div>
					</Fragment>	
				))}
			</div>
		);
	},
});