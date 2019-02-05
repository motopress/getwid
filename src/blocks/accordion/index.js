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

const baseClass = 'wp-block-getwid-accordion';

// Register the block
registerBlockType('getwid/accordion', {
	title: __('Accordion', 'getwid'),
	icon: {
		src: 'menu',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('Getwid', 'getwid'),
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
				'wp-block-getwid-accordion--icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
			>
				{titles.map((item, index) => (
					<Fragment>
						<div className="wp-block-getwid-accordion__header-wrapper" key={'header'}>
							<Tag className='wp-block-getwid-accordion__header'>
								<a href="#">
									<RichText.Content tagName='span' className='wp-block-getwid-accordion__header-title' value={item.content}/>
									<span className="wp-block-getwid-accordion__icon wp-block-getwid-accordion__icon--active"><i className="fas fa-plus"></i></span>
									<span className="wp-block-getwid-accordion__icon wp-block-getwid-accordion__icon--passive"><i className="fas fa-minus"></i></span>
								</a>
							</Tag>							
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