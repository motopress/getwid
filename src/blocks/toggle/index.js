/**
* External dependencies
*/
import classnames from 'classnames';
import './style.scss'
import attributes from './attributes';
import edit from './edit';


/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
const {
	registerBlockType,
} = wp.blocks;
const {
	RichText
} = wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-toggle';


/**
* Register the block
*/
registerBlockType('getwid/toggle', {
	title: __('Toggle', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0,0v11h24V0H0z M22,9H2V2h20V9z"/><path d="M0,13v11h24V13H0z M22,22H2v-7h20V22z"/><rect x="4" y="4" width="3" height="3"/><rect x="4" y="17" width="3" height="3"/></svg>,	
	category: 'getwid-blocks',
	keywords: [
		__('accordion', 'getwid')
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
				iconOpen,
				iconClose,
				active,
				headerTag,

				className
			}
		} = props;

		const Tag = headerTag;

		return (
			<div className={classnames(className, {
				'has-icon-left': iconPosition === 'left'
				})} 
				data-active-element={active}
			>
				{titles.map((item, index) => (
		
					<div className={`${baseClass}__row`}>
						<div className={`${baseClass}__header-wrapper`}>
							<Tag className={`${baseClass}__header`}>
								<a href="#">
									<RichText.Content tagName='span' className={`${baseClass}__header-title`} value={item.content}/>
									<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
									<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
								</a>
							</Tag>	
						</div>
						<div className={`${baseClass}__content`}>
							<RichText.Content value={items[index].content}/>
						</div>
					</div>	
				))}
			</div>
		);
	},
});