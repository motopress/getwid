/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';

/**
* Internal dependencies
*/
import Inspector from './inspector';

import './editor.scss';

/**
* WordPress dependencies
*/
const { select } = wp.data;
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { ServerSideRender } = wp.components;
const { BlockAlignmentToolbar, AlignmentToolbar, BlockControls, withColors } = wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-post-slider';

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState    = this.getState.bind( this );		
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	getState(value) {
		return this.state[ value ];
	}

	destroySlider() {
		clearInterval( this.waitLoadPosts );

		const sliderElement  = $( ReactDOM.findDOMNode( this ) );
		const sliderSelector = $( `.${baseClass}__content`, sliderElement );

		sliderSelector.hasClass( 'slick-initialized' ) && sliderSelector.unslick();
	}

	initSlider() {
		const {
			attributes: {
				sliderAnimationEffect,
				sliderAnimationSpeed,
				sliderAutoplaySpeed,
				sliderAutoplay,
				sliderInfinite,
				sliderArrows,
				sliderDots
			}
		} = this.props;

		this.waitLoadPosts = setInterval( () => {

			const elementById = $( `#block-${this.props.clientId}` );
			const sliderSelector = elementById.find( `.${baseClass}__content` );

			if ( sliderSelector.length && sliderSelector.hasClass( 'no-init-slider' ) ){
				
				sliderSelector.imagesLoaded().done( () => {
	
					sliderSelector.not( '.slick-initialized' ).slick( {
						arrows: sliderArrows != 'none' ? true : false,
						dots  : sliderDots   != 'none' ? true : false,

						autoplay: sliderAutoplay,
						infinite: sliderInfinite,

						speed		 : parseInt( sliderAnimationSpeed ),
						autoplaySpeed: parseInt( sliderAutoplaySpeed ),
						fade		 : sliderAnimationEffect == 'fade' ? true : false,
						
						rows: 0,
						slidesToShow: 1,
						slidesToScroll: 1,
	
						centerMode    : false,
						variableWidth : false,
						pauseOnHover  : true,
						adaptiveHeight: true
					} );
					sliderSelector.removeClass( 'no-init-slider' );
				});

				clearInterval( this.waitLoadPosts );
			}
		}, 1);
	}

	componentDidMount() {
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
	}

	componentDidUpdate(prevProps, prevState) {
		if ( !isEqual( prevProps.attributes, this.props.attributes ) ) {
			this.initSlider();
		}
	}

	render() {
		const {
			attributes: {
				align,
				postTemplate,
				textAlignment
			},
			setAttributes
		} = this.props;

		const { changeState, getState } = this;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{ changeState },
					...{ getState },
				}} key={ 'inspector' }/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= { [ 'wide', 'full' ] }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					{ ( ! postTemplate || postTemplate == '') && (
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes( { textAlignment } ) }
						/>		
					)}			
				</BlockControls>
				<ServerSideRender
					block={ 'getwid/post-slider' }
					attributes={ this.props.attributes }
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );