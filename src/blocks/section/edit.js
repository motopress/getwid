import classnames from 'classnames';
import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
const {
	InnerBlocks,
	withColors
} = wp.editor;
const {compose} = wp.compose;
/**
 * Create an Inspector Controls wrapper Component
 */
class Edit extends Component {

	render() {
		const {
			attributes: {
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				backgroundImage,
				sliderImages,
				backgroundVideoUrl,
				foregroundOpacity,
				foregroundColor,
				foregroundFilter,
				dividersBringTop,
				align,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,
			},
			className,
			setBackgroundColor,
			backgroundColor,

			baseClass,
			clientId,
			prepareGradientStyle,
			prepareBackgroundImageStyles,
			convertHorizontalAlignToStyle,
			convertVerticalAlignToStyle
		} = this.props;

		const sectionStyle = {
			//Fix: for editor-only margin top & bottom rullers
			/*paddingTop : marginTop,
			paddingBottom : marginBottom,*/
			marginTop,
			marginBottom,
		};

        const wrapperStyle = {
			minHeight: minHeight,
            marginLeft,
			marginRight,
			justifyContent: convertHorizontalAlignToStyle(horizontalAlign),
			alignItems: convertVerticalAlignToStyle(verticalAlign),
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,
        }

		const backgroundStyle = {
			backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
			// backgroundColor: backgroundColor,
			...prepareGradientStyle('background', this.props),
			...prepareBackgroundImageStyles('background', this.props)
		};

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', this.props),
			...prepareBackgroundImageStyles('foreground', this.props),
			mixBlendMode: foregroundFilter,
		};

		const innerWrapperStyle = {
			maxWidth: contentMaxWidth ? `${contentMaxWidth}px` : undefined,
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms'
		} : {};

		return (
            <div
                className={classnames(className, {
                    [`getwid-anim`]: !!entranceAnimation,
                    [`${entranceAnimation}`]: !!entranceAnimation,
                    [`${baseClass}-${clientId}`]: true,
                    // 'alignfull': align === 'full',
                    // 'alignwide': align === 'wide'
                })}
                style={sectionStyle}
                {...wowData}
            >
                <div className={`${baseClass}__wrapper`} style={wrapperStyle}>
                    <Dividers {...{...this.props, baseClass}} />

                    {/*marginTop &&
                        <Fragment>
                            <div className={`${baseClass}__margin-top-resize`} style={{top: marginTop}}></div>
                            <div className={`${baseClass}__margin-top`} style={{height: marginTop}}>
                                <span className={`${baseClass}__margin-top-counter`}>{marginTop}</span>
                            </div>
                        </Fragment>
                    */}

                        <div className={classnames(`${baseClass}__inner-wrapper`, {
								[`${baseClass}__inner-wrapper--dividers-over`]: dividersBringTop,
							})} style={innerWrapperStyle}>
                            <div className={`${baseClass}__background-holder`}>
                                <div className={backgroundClass} style={backgroundStyle}>
                                    {
                                        backgroundImage &&
                                        <img className={`${baseClass}__background-image`} src={backgroundImage.url}
                                             alt={backgroundImage.alt} data-id={backgroundImage.id}/>
                                    }
                                    {
										!!sliderImages.length &&
                                        <BackgroundSlider {...{...this.props, baseClass}} />
                                    }
									{
										backgroundVideoUrl &&
										<BackgroundVideo {...{...this.props, baseClass}} />
									}
                                </div>
                                <div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
                            </div>
                            <div className={`${baseClass}__content`}>

                                {/*paddingTop &&
                                    <Fragment>
                                        <div className={`${baseClass}__padding-top-resize`} style={{top: paddingTop}}></div>
                                        <div className={`${baseClass}__padding-top`} style={{height: paddingTop}}>
                                            <span className={`${baseClass}__padding-top-counter`}>{paddingTop}</span>
                                        </div>
                                    </Fragment>
                                */}

                                    <div className={`${baseClass}__inner-content`}>
                                        <InnerBlocks/>
                                    </div>

                                {/*paddingBottom &&
                                    <Fragment>
                                        <div className={`${baseClass}__padding-bottom-resize`}></div>
                                        <div className={`${baseClass}__padding-bottom`} style={{height: paddingBottom}}>
                                            <span className={`${baseClass}__padding-bottom-counter`}>{paddingBottom}</span>
                                        </div>
                                    </Fragment>
                                */}

                            </div>
                        </div>

                    {/*marginBottom &&
                        <Fragment>
                            <div className={`${baseClass}__margin-bottom-resize`}></div>
                            <div className={`${baseClass}__margin-bottom`} style={{height: marginBottom}}>
                                <span className={`${baseClass}__margin-bottom-counter`}>{marginBottom}</span>
                            </div>
                        </Fragment>
                    */}
                </div>
            </div>

		);
	}
	componentDidMount(){
		const {
			attributes: {
				entranceAnimation,
			},
			baseClass,
			setAttributes
		} = this.props;

		let {
			attributes: {
				paddingTop,
				paddingBottom,
				marginTop,
				marginBottom,
			}
		} = this.props;

		const sectionEl = $(ReactDOM.findDOMNode(this));

/*		const margin_top = sectionEl.find(`.${baseClass}__margin-top`);
		const margin_top_resize = sectionEl.find(`.${baseClass}__margin-top-resize`);

		const padding_top = sectionEl.find(`.${baseClass}__padding-top`);
		const padding_top_resize = sectionEl.find(`.${baseClass}__padding-top-resize`);
		const inner_content = sectionEl.find(`.${baseClass}__inner-content`);
		const padding_bottom_resize = sectionEl.find(`.${baseClass}__padding-bottom-resize`);
		const padding_bottom = sectionEl.find(`.${baseClass}__padding-bottom`);

		const margin_bottom_resize = sectionEl.find(`.${baseClass}__margin-bottom-resize`);
		const margin_bottom = sectionEl.find(`.${baseClass}__margin-bottom`);*/

		//Paddings
			//Top
/*			padding_top_resize.draggable({
				axis: "y",
				containment: `.${baseClass}__content`,
				start: function(event, ui) {
					ui.helper.css('opacity', 0.5);
				},
				drag: function(event, ui) {
					padding_top.css('height', ui.position.top);
					inner_content.css('padding-top', ui.position.top);
					padding_top.children('span').text(ui.position.top+'px');

					if (ui.position.top == 0){
						return false;
					}
				},
				stop: function(event, ui) {
					ui.helper.css('opacity', '');
					setAttributes({paddingTop: ui.position.top+'px'});
				}
			});

			//Bottom
			padding_bottom_resize.draggable({
				axis: "y",
				create: function( event, ui ) {
					jQuery(this).css({
						bottom: 0
					});
				},
				start: function(event, ui) {
					ui.helper.css('opacity', 0.5);
				},
				drag: function(event, ui) {
					ui.helper.css('bottom', "auto");
					padding_bottom.css('height', (parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top)));
					inner_content.css('padding-bottom', (parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top)));
					padding_bottom.children('span').text((parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px');

					if ((parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top)) < 0 ){
						return false;
					}
				},
				stop: function(event, ui) {
					ui.helper.css({ opacity: "", top: "", bottom: 0 });
					if ((parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top)) < 0 ){
						setAttributes({paddingBottom: 0+'px'});
						paddingBottom = 0+'px';
					} else {
						setAttributes({paddingBottom: (parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px'});
						paddingBottom = (parseInt(paddingBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px';
					}
				}
			});

		//Margin
			//Top
			margin_top_resize.draggable({
				axis: "y",
				start: function(event, ui) {
					ui.helper.css('opacity', 0.5);
				},
				drag: function(event, ui) {
					margin_top.css('height', ui.position.top);
					sectionEl.css('padding-top', ui.position.top);
					margin_top.children('span').text(ui.position.top+'px');

					if (ui.position.top <= 0){
						return false;
					}
				},
				stop: function(event, ui) {
					ui.helper.css('opacity', '');
					if (ui.position.top <= 0){
						setAttributes({marginTop: 0+'px'});
					} else {
						setAttributes({marginTop: ui.position.top+'px'});
					}
				}
			});

			//Bottom
			margin_bottom_resize.draggable({
				axis: "y",
				create: function( event, ui ) {
					jQuery(this).css({
						bottom: 0
					});
				},
				start: function(event, ui) {
					ui.helper.css('opacity', 0.5);
				},
				drag: function(event, ui) {
					ui.helper.css('bottom', "auto");
					margin_bottom.css('height', (parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top)));
					sectionEl.css('padding-bottom', (parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top)));
					margin_bottom.children('span').text((parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px');

					if ((parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top)) < 0 ){
						return false;
					}
				},
				stop: function(event, ui) {
					ui.helper.css({ opacity: "", top: "", bottom: 0 });
					if ((parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top)) < 0 ){
						setAttributes({marginBottom: 0+'px'});
						marginBottom = 0+'px';
					} else {
						setAttributes({marginBottom: (parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px'});
						marginBottom = (parseInt(marginBottom, 10) - (ui.originalPosition.top - ui.position.top))+'px';
					}
				}
			});*/


		if (!!entranceAnimation) {
			this.animate();
		}
	}

	componentDidUpdate(prevProps){
		const {attributes: {
			entranceAnimation,
			entranceAnimationDuration
		}, baseClass, clientId} = this.props;

		const prevEntranceAnimation = prevProps.attributes.entranceAnimation,
			prevEntranceAnimationDuration = prevProps.attributes.entranceAnimationDuration;

		// Animate only on change effect or duration
		if (!!entranceAnimation && (
				prevEntranceAnimation !== entranceAnimation
				|| prevEntranceAnimationDuration !== entranceAnimationDuration
			)
		) {
			// WOW.js don't update animation-name style so reset it manually
			jQuery(`.${baseClass}-${clientId}`).css('animation-name', '');

			this.animate();
		}
	}

	animate(){
		const {baseClass, clientId} = this.props;

		// Reinit wow only for current block
		new WOW({
			boxClass: `${baseClass}-${clientId}`,
			scrollContainer: '.edit-post-layout__content',
			live: false,
			mobile: false
		}).init();
	}

}

export default compose( [
	withColors( 'backgroundColor' ),
] )( Edit );