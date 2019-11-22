/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';
import { times, escape } from 'lodash';

const { Component, Fragment } = wp.element;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-hotspot';


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
				hoverAnimation,
				imagePoints,

				tooltipTrigger,
				tooltipTheme,
				tooltipArrow,
				tooltipAnimation,

				dotIcon,
				dotSize,
				dotPaddings,
				dotColor,
				dotBackground,
				dotOpacity,
				dotPulse,
				dotAppearanceAnimation,

				className,
			},
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const wrapperProps = {
			className: classnames( className,
				{
					'getwid-animation': !! hoverAnimation,
					['has-animated-dots']: dotAppearanceAnimation !== 'none'
				},
			),
			'data-animation': hoverAnimation ? hoverAnimation : undefined,
			'data-appearance-animation': dotAppearanceAnimation ? dotAppearanceAnimation : undefined
		};

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image ` + (id ? `wp-image-${ id }` : '') }/>) : null;

		const renderPoints = ( index ) => {
			if (typeof imagePointsParsed[ index ] !== 'undefined') {

				const dotClass = classnames(
					`${baseClass}__dot`,
					{
						[`has-animation-${dotPulse}`] : (dotPulse != 'none')
					},
				);

				const dotStyle = {
					padding: dotPaddings && dotPaddings != 6 ? dotPaddings : undefined,
					opacity: dotOpacity && dotOpacity != 100 ? (dotOpacity/100) : undefined,
					left: imagePointsParsed[ index ].position.x ? imagePointsParsed[ index ].position.x : undefined,
					top: imagePointsParsed[ index ].position.y ? imagePointsParsed[ index ].position.y : undefined,

					//Override
					backgroundColor: imagePointsParsed[ index ].backgroundColor ? imagePointsParsed[ index ].backgroundColor : (dotBackground ? dotBackground : undefined),
				};

				const innerDotStyle = {
					//Override
					color: imagePointsParsed[ index ].color ? imagePointsParsed[ index ].color : (dotColor ? dotColor : undefined),
					fontSize: dotSize && dotSize != 16 ? dotSize : undefined,
				};

				var link_HTML = '';
				const link_attr = {
					target: imagePointsParsed[ index ].newTab ? "_blank" : undefined,
					rel: imagePointsParsed[ index ].newTab ? "noopener noreferrer" : undefined,
				};

				var icon = imagePointsParsed[ index ].icon ? imagePointsParsed[ index ].icon : (dotIcon ? dotIcon : undefined)

				if (imagePointsParsed[ index ].link !=''){
					link_HTML = (<a href={imagePointsParsed[ index ].link} {...link_attr}>{imagePointsParsed[ index ].title}</a>);
				} else {
					link_HTML = imagePointsParsed[ index ].title;
				}

				return (
					<Fragment>
						<div data-point-id={index} className={dotClass} style={dotStyle}>
							<div className={`${baseClass}__dot-wrapper`}>
								<div style={innerDotStyle} className={`${baseClass}__dot-content`}><i className={`${icon} ${baseClass}__dot-icon`}></i></div>
							</div>
							<div className={`${baseClass}__dot-description`}>
								<div className={`${baseClass}__dot-title`}>{link_HTML}</div>
							</div>
						</div>
					</Fragment>
				);
			}
		};

		const innerWrapperProps = {
			className: classnames(
				`${baseClass}__wrapper`
			),
		};

		const imagePointsArr = {
			'data-image-points' : escape(imagePoints),
		};

		const tooltipOptions = {
			'data-trigger' : tooltipTrigger,
			'data-theme' : tooltipTheme,
			'data-tooltip-animation' : tooltipAnimation,
			'data-arrow' : tooltipArrow,
		};

		return (
			<div {...wrapperProps} {...imagePointsArr} {...tooltipOptions}>
				<div {...innerWrapperProps} >
					{imageHTML}
					{(imagePointsParsed.length != 0) && (
						<Fragment>
							{ times( imagePointsParsed.length, n => renderPoints( n ) ) }
						</Fragment>
					)}
				</div>
			</div>
		);
	}
}
export default Save;