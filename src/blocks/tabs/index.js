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
import { __ } from 'wp.i18n';
const {
	registerBlockType,
	createBlock
} = wp.blocks;
const {
	RichText
} = wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-tabs';


/**
* Register the block
*/
registerBlockType('getwid/tabs', {
	title: __('Tabs', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,2H10V0H0V24H24V2ZM10,4h5V6H10ZM22,22H2V2H8V8H22ZM22,6H17V4h5Z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		align: [ 'wide', 'full' ],
		anchor: true,
	},
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/toggle' ],
				transform: function( attributes ) {
					return createBlock( 'getwid/toggle', attributes );
				},
			},		
			{
				type: 'block',
				blocks: [ 'getwid/accordion' ],
				transform: function( attributes ) {
					return createBlock( 'getwid/accordion', attributes );
				},
			},
		],
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

				className,
				anchor
			}
		} = props;

		const Tag = headerTag;

		const id = anchor ? anchor : undefined;

		return (
			<div
				id={id}
				className={classnames(className,
                    {
                        [`has-layout-${type}`]: type !== ''
                    }
				)}
				data-active-tab={active}
			>
				<ul className={`${baseClass}__nav-links`}>
					{titles.map((item, index) => (
						<li className={`${baseClass}__nav-link`} key={index}>

							<Tag className={`${baseClass}__title-wrapper`}>
								<a href={`#tab-${index}`}>
									<RichText.Content tagName='span' className={`${baseClass}__title`} value={item.content}/>
								</a>
							</Tag>

						</li>
					))}
				</ul>
				{items.map((item, index) => (
					<div id={`tab-${index}`} className={`${baseClass}__tab-content`} key={index}>
						<RichText.Content value={item.content}/>
					</div>
				))}
			</div>
		);
	},
});