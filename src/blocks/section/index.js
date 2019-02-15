import classnames from 'classnames';
import BackgroundSlider from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';
import render_style from 'GetwidUtils/render-style';
const {
	prepareGradientStyle,
	prepareBackgroundImageStyles,
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle
} = render_style;

import './style.scss'

import attributes from './attributes';
import Inspector from './inspector';
import Edit from './edit';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

const {
	InnerBlocks,
	getColorClassName
} = wp.editor;

// Prefix for block classes
const baseClass = 'wp-block-getwid-section';

// Register the block
registerBlockType( 'getwid/section', {
	title: __( 'Section', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M13,0v24h11V0H13z M22,22h-7V2h7V22z"/><path d="M0,0v11h11V0H0z M9,9H2V2h7V9z"/><path d="M0,13v11h11V13H0z M9,22H2v-7h7V22z"/></svg>,		
	category: 'getwid-blocks',
	keywords: [
		__( 'container', 'getwid' ),
		__( 'Getwid', 'getwid' ),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
	},

	attributes: attributes,

	// Render the block components
	edit: props => {
		return [
			<Inspector {...{ ...props, baseClass }} key='inspector'/>,
			<Edit {...{
				...props,
				baseClass,
				prepareGradientStyle,
				prepareBackgroundImageStyles,
				convertHorizontalAlignToStyle,
				convertVerticalAlignToStyle
			}} key='edit'/>
		];
	},

	// Save the attributes and markup
	save:  props => {
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
				align,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,

				backgroundColor,
				customBackgroundColor,
			},
		} = props;

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
			backgroundColor: (props.attributes.backgroundColor ? undefined : props.attributes.customBackgroundColor),
			// backgroundColor: backgroundColor,
			...prepareGradientStyle('background', props),
			...prepareBackgroundImageStyles('background', props)
		};

		const backgroundClassName = getColorClassName( 'background-color', backgroundColor );

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClassName ]: backgroundClassName,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', props),
			...prepareBackgroundImageStyles('foreground', props),
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
				className={classnames(baseClass, {
					[`getwid-anim ${entranceAnimation}`]: !!entranceAnimation,
				})}
				style={sectionStyle}
				{...wowData}
			>
                <div className={`${baseClass}__wrapper`} style={wrapperStyle}>
                
                    <Dividers {...{...props, baseClass}} />
                    <div className={`${baseClass}__inner-wrapper`} style={innerWrapperStyle}>
                        <div className={`${baseClass}__background-holder`}>
                            <div className={backgroundClass} style={backgroundStyle}>
                                {
                                    !!backgroundImage &&
                                    <img className={`${baseClass}__background-image`} src={backgroundImage.url}
                                         alt={backgroundImage.alt} data-id={backgroundImage.id}/>
                                }
                                {
                                    !!backgroundVideoUrl &&
                                    <BackgroundVideo {...{...props, baseClass}} />
                                }
                                {
                                    !!sliderImages.length &&
                                    <BackgroundSlider {...{...props, baseClass}} />
                                }
                            </div>
                            <div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
                        </div>
                        <div className={`${baseClass}__content`}>
                            <div className={`${baseClass}__inner-content`}>
                                <InnerBlocks.Content/>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	},
} );