/**
* External dependencies
*/
import classnames from 'classnames';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';
import getwid_animate from 'GetwidUtils/animate';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {compose} = wp.compose;
const {
    InnerBlocks,
} = wp.blockEditor || wp.editor;
const {
	withSelect
} = wp.data;
const {Component, Fragment} = wp.element;



/**
* Module Constants
*/
const TEMPLATE = [
    [ 'core/heading', { level: 3, placeholder: __('Write heading…', 'getwid') } ],
    [ 'core/paragraph', { placeholder: __('Write text…', 'getwid') } ],
];
const baseClass = 'wp-block-getwid-image-box';

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.changeState = this.changeState.bind( this );

		this.state = {
			isLockedMargins: false
		}
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
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
				mobileAlignment,
			},
			className,
			isSelected,
			setAttributes,
			changeImageSize,
			onSelectMedia
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

		const imageContainerProps = classnames(
			`${baseClass}__image-container`,
		{
			'is-position-top': imagePosition === 'top',
			'is-position-middle': imagePosition === 'middle',
			'is-position-bottom': imagePosition === 'bottom',
		});

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames(
				`${baseClass}__image-wrapper`,
			)
		};

		const changeState = this.changeState;
		const { isLockedMargins } = this.state;

		return (
			<Fragment>
				{ !!url && (
					<Inspector
						{ ...{
							...this.props,
							setAttributes,
							changeState,
							changeImageSize,
							isLockedMargins,
							onSelectMedia
						} }
					/>
				)}
				<div {...wrapperProps}>
					<div style={wrapperStyle} className={imageContainerProps}>
						{link && (
							<a href={link}
							{...imageWrapperProps}
								// Prevent leaving edit page by image click
								onClick={event => event.preventDefault()}
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
			getwid_animate(this.imageWrapper, {
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