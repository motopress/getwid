/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const { select } = wp.data;
const { Component, Fragment } = wp.element;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText, getColorClassName } = wp.editor;


/**
* Module Constants
*/
const VIDEO_BACKGROUND_TYPE = 'video';
const baseClass = 'wp-block-getwid-banner';


/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes: {
				videoAutoplay,
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				contentMaxWidth,
				verticalAlign,
				horizontalAlign,

				rel,
				linkTarget,

				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,

				backgroundOpacity,
				blockAnimation,
				textAnimation,
				
				className
			}
		} = this.props;

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const imageProps = {
			className: classnames(
				`${baseClass}__wrapper`,
				{				
					'has-background': (backgroundColor || customBackgroundColor),
					[ backgroundClass ]: (backgroundClass),		
				}
			),
			style: {
				backgroundColor: (this.props.attributes.backgroundColor ? undefined : this.props.attributes.customBackgroundColor),
			},
		};

		const captionProps = {
			className: classnames(
				`${baseClass}__caption`,
				{
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass,
				},
			),
			style: {
				color: (typeof textColor != 'undefined' ? undefined : customTextColor),
				minHeight: minHeight,
			},
		};

		const wrapperProps = {
			className: classnames(
				className,
				{
					[ `has-animation-${blockAnimation}` ]: blockAnimation != 'none',
					[ `has-text-animation-${textAnimation}` ]: textAnimation != 'none',
					[ `has-foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `has-vertical-alignment-${verticalAlign}` ]: verticalAlign != 'center',
					[ `has-horizontal-alignment-${horizontalAlign}` ]: horizontalAlign != 'center',
				},
				align ? `align${ align }` : null,
			),
		};

		return (
			<div {...wrapperProps}>
				<a href={typeof link != 'undefined' ? link : '#'} target={ linkTarget } rel={ rel } className={`${baseClass}__link`}>

					{ !! url && (
						<div {...imageProps}>
							{ (VIDEO_BACKGROUND_TYPE === type && !!url ) ? (
								<video
									className= {`${baseClass}__video ${baseClass}__source`}
									autoPlay={videoAutoplay}
									muted
									loop
									src={ url }
								/>
							) : (<img src={ url } alt="" className={ `${baseClass}__image ${baseClass}__source ` + (id ? `wp-image-${ id }` : '') }/>) }

							<Fragment>
								<div {...captionProps}>
									<div style={{maxWidth: contentMaxWidth}} className= {`${baseClass}__caption-wrapper`}>
										{ ! RichText.isEmpty( title ) && (
											<RichText.Content tagName="span" className= {`${baseClass}__title`} value={ title } />
										) }

										{ ! RichText.isEmpty( text ) && (
											<RichText.Content tagName="p" className= {`${baseClass}__text`} value={ text } />
										) }
									</div>
								</div>
							</Fragment>
						</div>
					) }	
				</a>				
			</div>
		);
	}
}
export default Save;