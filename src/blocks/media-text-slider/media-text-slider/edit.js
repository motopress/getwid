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
		const {
			attributes:
			{
				slideCount,
				align,
				sliderArrays,
			},
			className,
			baseClass
		} = this.props;

		const { changeState, getState } = this;

		const sliderArraysParsed = JSON.parse( sliderArrays );

		const wrapperClass = classnames(
			className,
		{
			[ `${baseClass}--current-slide-${getState( 'currentSlide' )}` ]: true,
			'alignfull': align === 'full',
			'alignwide': align === 'wide'
		});

		//Recursive iterate object value
		const deepMap = ( obj, cb ) => {
			var out = {};
		  
			Object.keys(obj)
		  	.forEach(function( k ) {
		      var val;
		      if ( obj[ k] !== null && typeof obj[ k ] == 'object' ) {
		        val = deepMap( obj[ k ], cb );
		      } else {
		        val = cb( obj[ k ], k );
		      }

		      out[ k ] = val;
		    });
		  
		  return out;
		}

		const updateArrValues = ( value, index ) => {
			//Replace undefined to ''
			value = deepMap(value, function (v, k) {
				if ( typeof v == 'undefined' ){
					v = '';
				}
				return v;
			});

			const { attributes, setAttributes } = this.props;
			const { sliderArrays } = attributes;

			const sliderArraysParsed = JSON.parse( sliderArrays );

			const newItems = sliderArraysParsed.map( ( item, thisIndex ) => {
				if ( index == thisIndex ) {
					item = merge( item, value );
				}
				return item;
			} );

			setAttributes( {
				sliderArrays: JSON.stringify( newItems ),
			} );
		};

		const renderEditTitles = index => {
			if ( typeof sliderArraysParsed[ index ] !== 'undefined' ) {
				return (
					<Fragment>
						<li className={ `${baseClass}__title-wrapper ${baseClass}__title-wrapper-${ index } ${baseClass}__title-wrapper--${ ( 1 + index === getState('currentSlide') ? 'active' : 'inactive' ) }` }>
							<span className={ `${baseClass}__title ${baseClass}__title-${ 1 + index }` } onClick={ () => {
									changeState( 'currentSlide', 1 + index );
									changeState( 'selectedSlide', index );
								}
							}>
								<RichText
									tagName={ 'div' }
									placeholder={ __( 'Slide', 'getwid' ) }
									value={ sliderArraysParsed[ index ].text ? sliderArraysParsed[ index ].text : __( 'Slide', 'getwid' ) }
									unstableOnFocus={ () => changeState('currentSlide', 1 + index) }
									onChange={ value => {
										updateArrValues( { text: value }, index );
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
					...{ updateArrValues },
					...{isLockedPaddings},
					...{ changeState },
					...{ getState }
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