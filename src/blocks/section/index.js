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
	InnerBlocks
} = wp.editor;

// Prefix for block classes
const baseClass = 'wp-block-getwid-section';

// Register the block
registerBlockType( 'getwid/section', {
	title: __( 'Getwid Section', 'getwid' ),
	description: __( '@todo description', 'getwid' ),
	icon: {	
		src: 'editor-table',
	},		
	category: 'getwid-blocks',
	keywords: [
		__( 'container', 'getwid' ),
		__( 'section', 'getwid' ),
		__( 'getwid', 'getwid' ),
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
				backgroundColor,
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
        }

		const style = {
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,
		}

		const backgroundStyle = {
			backgroundColor: backgroundColor,
			...prepareGradientStyle('background', props),
			...prepareBackgroundImageStyles('background', props)
		};

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
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms',
			'data-wow-offset': '20'
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
                            <div className={`${baseClass}__background`} style={backgroundStyle}>
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
                            <div className={`${baseClass}__inner-content`} style={style}>
                                <InnerBlocks.Content/>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	},
} );