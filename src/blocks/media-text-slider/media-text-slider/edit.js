/**
 * Internal dependencies
 */
import Inspector from './inspector';
import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import memize from 'memize';
import classnames from 'classnames';
import { times, merge, isEqual } from 'lodash';

const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText } = wp.editor;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide' ];

const getPanesTemplate = memize( panes => (
	times( panes, index => [ 'getwid/media-text-slider-slide', { slideId: ++index } ] )
) );

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState 	 = this.getState.bind(this);

		this.setInnerBlocksAttributes = this.setInnerBlocksAttributes.bind(this);

		this.state = {
			currentSlide: 1,
			selectedSlide: 0,

			isLockedPaddings: false
		};
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[ value ];
	}

	setInnerBlocksAttributes(callFrom = 'mount', prevProps, prevState) {

		const {
			select,
			dispatch
		} = window.wp.data;

		const {
			attributes:
			{
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				imageSize
			},
		} = this.props;

		const InnerBlocksProps = {
			attributes:
			{
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				imageSize
			}
		};

		if ( callFrom == 'Update' ) {
			if ( isEqual(this.props.attributes, prevProps.attributes ) ) {
				return;
			}
		}

		const innerBlocksOuter = select( 'core/editor' ).getBlock( this.props.clientId ).innerBlocks;
		//Add parent attributes to children nodes
		if ( innerBlocksOuter.length ){
			jQuery.each( innerBlocksOuter, (index, item) => {

				if ( ( callFrom == 'Mount' && typeof item.attributes.outerParent == 'undefined') || callFrom == 'Update' ) {
					//Inner blocks
					dispatch( 'core/editor' ).updateBlockAttributes( item.clientId, { outerParent: InnerBlocksProps } );

					//Inner -> Inner blocks
					if ( typeof item.clientId != 'undefined' && item.innerBlocks.length ){
						dispatch( 'core/editor' ).updateBlockAttributes( item.innerBlocks[ 0 ].clientId, { innerParent: InnerBlocksProps } );
					}
				}
			});
		}
	}

	componentDidMount() {
		this.setInnerBlocksAttributes( 'Mount' );
	}

	componentDidUpdate(prevProps, prevState) {
		this.setInnerBlocksAttributes( 'Update', prevProps, prevState );
	}

	render() {
		
		const { changeState, getState } = this;
		const { slideCount, align, sliderArrays } = this.props.attributes;
		const { className, baseClass } = this.props;		

		const sliderArraysParsed = JSON.parse( sliderArrays );

		const wrapperClass = classnames( className, {
			[ `${baseClass}--current-slide-${getState( 'currentSlide' )}` ]: true,
			'alignfull': align === 'full',
			'alignwide': align === 'wide'
		});		

		const updateSlideLabel = ( value, index ) => {

			const { setAttributes } = this.props;
			const sliderArraysParsed = JSON.parse( sliderArrays );

			sliderArraysParsed[ index ] = value;

			setAttributes( {
				sliderArrays: JSON.stringify( sliderArraysParsed )
			} );
		};

		const renderEditTitles = index => {
			if ( typeof sliderArraysParsed[ index ] !== 'undefined' ) {
				return (
					<Fragment>
						<li className={ `${baseClass}__title-wrapper ${baseClass}__title-wrapper-${ index } ${baseClass}__title-wrapper--${ ( 1 + index === getState('currentSlide') ? 'active' : 'inactive' ) }` }>
							<span className={ `${baseClass}__title ${baseClass}__title-${ 1 + index }` } onClick={ () => {
									changeState( 'currentSlide' , 1 + index );
									changeState( 'selectedSlide', index     );
								}
							}>
								<RichText
									tagName={ 'div' }
									placeholder={ __( 'Slide', 'getwid' ) }
									value={ sliderArraysParsed[ index ] ? sliderArraysParsed[ index ] : __( 'Slide', 'getwid' ) }
									unstableOnFocus={ () => changeState('currentSlide', 1 + index) }
									onChange={ value => {
										updateSlideLabel( value, index );
									} }
									formattingControls={ [ ] }
									className={ `${baseClass}__title_text` }
								/>
							</span>
						</li>
					</Fragment>
				);
			}			
		};

		const { isLockedPaddings } = this.state;

		return (
			<Fragment>
				<Inspector { ...{
					...this.props,
					...{isLockedPaddings},
				} } key={ 'inspector' }/>

				<div className={ wrapperClass }>
					<div className={ `${baseClass}__slides-wrapper` }>
						<ul className={ `${baseClass}__titles` }>
							<Fragment>
								{ times( slideCount, index => renderEditTitles( index ) ) }
							</Fragment>
						</ul>
						<div className={ `${baseClass}__content` }>
							<InnerBlocks
								template={ getPanesTemplate( slideCount ) }
								templateLock={ 'all' }
								templateInsertUpdatesSelection={ false }
								allowedBlocks={ ALLOWED_BLOCKS }
							/>						
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default ( Edit );