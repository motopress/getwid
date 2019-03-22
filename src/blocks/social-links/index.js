import classnames from 'classnames';

import './style.scss'

import attributes from './attributes';
import edit from './edit';

const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	RichText,
	getColorClassName
} = wp.editor;

// Register the block
registerBlockType('getwid/social-links', {
	title: __('Social Links', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18,16c-1,0-1.9,0.4-2.6,1l-6.6-3.8C8.9,12.8,9,12.4,9,12s-0.1-0.8-0.2-1.2L15.4,7C16.1,7.6,17,8,18,8c2.2,0,4-1.8,4-4 s-1.8-4-4-4s-4,1.8-4,4c0,0.5,0.1,0.9,0.3,1.4L7.8,9.1C7,8.4,6.1,8,5,8c-2.2,0-4,1.8-4,4s1.8,4,4,4c1.1,0,2-0.4,2.8-1.1l6.5,3.7	C14.1,19.1,14,19.5,14,20c0,2.2,1.8,4,4,4s4-1.8,4-4S20.2,16,18,16z M18,2c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S16.9,2,18,2z M5,14c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S6.1,14,5,14z M18,22c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S19.1,22,18,22z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__('facebook', 'getwid'),
		__('twitter', 'getwid'),
		__('share', 'getwid')
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
				textAlignmentDesktop,
				textAlignmentTablet,
				textAlignmentMobile,
				icons,
				iconsStyle,
				iconsSize,
				iconsSpacing,

				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor				
			}
		} = props;

		const className = 'wp-block-getwid-social-links';
		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const icon_render = (item) => {
			const icon_block = () => {

				return(
					<Fragment>
						<span
							className={
								classnames(`${className}__wrapper`,{			
									'has-text-color': textColor || customTextColor,
									[ textClass ]: textClass,
									'has-background': (backgroundColor || customBackgroundColor) && 'stacked' == iconsStyle,
									[ backgroundClass ]: (backgroundClass) && 'stacked' == iconsStyle,
								})
							}
							style={{
								color: (customTextColor ? customTextColor : undefined),
								backgroundColor : (iconsStyle == 'stacked' ? (customBackgroundColor ? customBackgroundColor : undefined) : undefined)
							}}							
						>
							<i
							style={{
								color: (item.color ? item.color : undefined),
								backgroundColor : (iconsStyle == 'stacked' ? (item.background ? item.background : undefined) : undefined)
							}}
							className={item.icon}
							data-color={(item.color ? item.color : undefined)}
							data-bg-color={(item.background ? item.background : undefined)}
							></i>
						</span>
					</Fragment>
				);
			};

			return (
				<a
					className={`${className}__link`}
					href={(item.link !='' ? item.link : '#')}
					target={ (item.linkTarget == '_blank' ? item.linkTarget : undefined ) }
					rel={ (item.rel ? item.rel : undefined ) }
				>
					{icon_block()}
				</a>
			);
		};

		return (
			<div className={classnames(className,
				`is-${iconsSpacing}-spacing`,
				{
					[`is-stacked`]: iconsStyle === 'stacked',
					[`is-framed`]: iconsStyle === 'framed',

					//Desktop
					[`getwid-justify-content-flex-start`]: 'left' === textAlignmentDesktop,
					[`getwid-justify-content-center`]: 'center' === textAlignmentDesktop,
					[`getwid-justify-content-flex-end`]: 'right' === textAlignmentDesktop,

					//Tablet
					[`getwid-justify-content-tablet-flex-start`]: 'left' === textAlignmentTablet,
					[`getwid-justify-content-tablet-center`]: 'center' === textAlignmentTablet,
					[`getwid-justify-content-tablet-flex-end`]: 'right' === textAlignmentTablet,
					
					//Mobile
					[`getwid-justify-content-mobile-flex-start`]: 'left' === textAlignmentMobile,
					[`getwid-justify-content-mobile-center`]: 'center' === textAlignmentMobile,
					[`getwid-justify-content-mobile-flex-end`]: 'right' === textAlignmentMobile,	
				}	
			)}
			style={{
				fontSize: iconsSize,
			}}>
				<ul className={`${className}__list`}>
					{icons.map((item, index) => {

						const item_classes = classnames(`${className}__item`);

						return(
							<li	className={item_classes}>
								{icon_render(item)}
							</li>
						);
					})}
				</ul>
			</div>
		);

	},
});