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
	RichText
} = wp.editor;

// Register the block
registerBlockType('getwid/social-links', {
	title: __('Social links', 'getwid'),
	// icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,2H10V0H0V24H24V2ZM10,4h5V6H10ZM22,22H2V2H8V8H22ZM22,6H17V4h5Z"/></svg>,
	icon: {
		src: 'twitter',
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
				textAlignment,
				icons,
				iconsColor,
				iconsBgColor,
				iconsStyle,
				iconsSize,
				iconsSpacing,
			}
		} = props;

		const className = 'wp-block-getwid-social-links';

		const icon_render = (item) => {
			const icon_block = () => {
				
				return(
					<Fragment>
						<i style={{
							color: (item.color ? item.color : undefined),
							backgroundColor : (iconsStyle == 'stacked' ? (item.background ? item.background : (iconsBgColor ? iconsBgColor : undefined)) : undefined)
						}} className={item.icon}></i>
						{ item.title && (
							<span className={`${className}__label`}>{item.title}</span>
						)}
					</Fragment>
				);
			};

			return (
				<a
					className={`${className}__link`}
					href={(item.link !='' ? item.link : '#')}
					target={ item.linkTarget }
					rel={ item.rel }
				>
					{icon_block()}
				</a>
			);
		};

		return (
			<ul className={classnames(className,
				`is-${iconsSpacing}-spacing`,
				{
					[`is-stacked`]: iconsStyle === 'stacked',
					[`is-framed`]: iconsStyle === 'framed',

					[`is-icons-left`]: 'left' === textAlignment,
					[`is-icons-center`]: 'center' === textAlignment,
					[`is-icons-right`]: 'right' === textAlignment,
				}	
			)}
			style={{
				fontSize: iconsSize,
				color: iconsColor
			}}>
				{icons.map((item, index) => {

					const item_classes = classnames(`${className}__item`);

					return(
						<li	className={item_classes}>
							{icon_render(item)}
						</li>
					);
				})}
			</ul>
		);

	},
});