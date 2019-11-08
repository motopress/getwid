/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const { Component } = wp.element;
const { InnerBlocks } = wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-box';


/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes: {
				id,
				url,
				alt,
				textAlignment,
				layout,
				imagePosition,
				link,
				hoverAnimation,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				mobileLayout,
				mobileAlignment,

				rel,
				linkTarget,

				className,
			},
		} = this.props;

		const wrapperProps = {
			className: classnames( className,
				{
					'getwid-animation': !! hoverAnimation,
					[`has-image-left`]: 'left' === layout,
					[`has-image-right`]: 'right' === layout,

					[`has-text-left`]: 'left' === textAlignment,
					[`has-text-center`]: 'center' === textAlignment,
					[`has-text-right`]: 'right' === textAlignment,
				},
				`has-mobile-layout-${mobileLayout}`,
				`has-mobile-alignment-${mobileAlignment}`,
			),
			'data-animation': hoverAnimation ? hoverAnimation : undefined
		};

		const imageContainerProps = classnames(
			`${baseClass}__image-container`,
		{
			'is-position-top': imagePosition === 'top',
			'is-position-middle': imagePosition === 'middle',
			'is-position-bottom': imagePosition === 'bottom',
		});

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` + (id ? `wp-image-${ id }` : '') }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames(
				`${baseClass}__image-wrapper`,
			),
		};

		return (
			<div {...wrapperProps}>
				<div style={wrapperStyle} className={imageContainerProps}>
					{link && (
						<a href={link}
						   target={ linkTarget }
						   rel={ rel }
						   {...imageWrapperProps}
						>
							{imageHTML}
						</a>
					)}
					{!link && (
						<div {...imageWrapperProps} >
							{imageHTML}
						</div>
					)}
				</div>

				<div className={`${baseClass}__content`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	}
}
export default Save;