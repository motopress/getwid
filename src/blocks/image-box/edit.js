/**
* External dependencies
*/
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';


/**
* WordPress dependencies
*/
const {compose} = wp.compose;
const {
    InnerBlocks,
} = wp.editor;
const {
	withSelect
} = wp.data;
const {Component, Fragment} = wp.element;
const $ = window.jQuery;


/**
* Module Constants
*/
const TEMPLATE = [
    [ 'core/heading', { level: 3, placeholder: __('Write heading…', 'getwid') } ],
    [ 'core/paragraph', { placeholder: __('Write text…', 'getwid') } ],
];


/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				imageSize,
				id,
				url,
				alt,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				textAlignment,
				layout,
				imagePosition,
				link,
				hoverAnimation,
                mobileLayout,
                mobileAlignment
			},
			className,
			isSelected,
			setAttributes,
			changeImageSize
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
					'is-selected': isSelected,
				},
                `has-mobile-layout-${mobileLayout}`,
                `has-mobile-alignment-${mobileAlignment}`
			),
            'data-animation': hoverAnimation ? hoverAnimation : undefined,
			onMouseEnter: (e)=>this.onimageHoverIn(),
		};

		const imageContainerProps = classnames('wp-block-getwid-image-box__image-container', {
			'is-position-top': imagePosition === 'top',
			'is-position-middle': imagePosition === 'middle',
			'is-position-bottom': imagePosition === 'bottom',
		});

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${className}__image` }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames(
				'wp-block-getwid-image-box__image-wrapper',
			),
		};

		return (
			<Fragment>
				{ !! url && (
					<Inspector {...{ setAttributes, ...this.props, changeImageSize }} key='inspector'/>
				) }			
				<div {...wrapperProps}>

					<div style={wrapperStyle} className={imageContainerProps}>
						{link && (
							<a href={link}
							{...imageWrapperProps}
								// Prevent leaving edit page by image click
								onClick={(e)=>e.preventDefault()}
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

					<div className={`${className}__content`}>
						<InnerBlocks
							template={ TEMPLATE }
							templateInsertUpdatesSelection={ false }
							templateLock={ false }
						/>
					</div>
				</div>
			</Fragment>
		);
	}

	setupimageWrapper(){
		const {
			clientId
		} = this.props;

		this.imageWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-image-box__image-wrapper`);
	}

	componentDidMount(){
		this.setupimageWrapper();
	}

	componentDidUpdate(prevProps){
		this.setupimageWrapper();
	}

	onimageHoverIn(){
		const {
			attributes: {
				hoverAnimation
			},
		} = this.props;

		if (hoverAnimation) {
			animate(this.imageWrapper, {
				animation: hoverAnimation
			});
		}
	}

}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;

		if (typeof id !='undefined'){
			return {
				imgObj: id ? getMedia( id ) : null,
			};
		}
	} ),
] )( Edit );