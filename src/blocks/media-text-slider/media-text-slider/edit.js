/**
* External dependencies
*/
import classnames from 'classnames';
import memize from 'memize';
import Inspector from './inspector';
import './editor.scss';
import {
	times,
	map,
	merge,
	isEqual
} from "lodash";


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.editor;
const {
	dispatch
} = wp.data;
import { __ } from '@wordpress/i18n';


/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide' ];
const getPanesTemplate = memize( ( panes ) => {
	return times( panes, n => [ 'getwid/media-text-slider-slide', { id: n + 1 } ] );
} );


/**
* Create an Component
*/
class Edit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.setInnerBlocksAttributes = this.setInnerBlocksAttributes.bind(this);

		this.state = {
			currentSlide: 1,
			selectedSlide: 0
		};		
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	setInnerBlocksAttributes(callFrom = 'mount', prevProps, prevState){
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

		if (callFrom == 'Update'){
			if (isEqual(this.props.attributes, prevProps.attributes)){
				return;
			}
		}

		const innerBlocksOuter = select('core/editor').getBlock(this.props.clientId).innerBlocks;
		//Add parent attributes to children nodes
		if (innerBlocksOuter.length){
			jQuery.each(innerBlocksOuter, (index, item) => {

				if ((callFrom == 'Mount' && typeof item.attributes.outerParent == 'undefined') || callFrom == 'Update'){
					//Inner blocks
					dispatch('core/editor').updateBlockAttributes(item.clientId, { outerParent: InnerBlocksProps });

					//Inner -> Inner blocks
					if (typeof item.clientId != 'undefined' && item.innerBlocks.length){
						dispatch('core/editor').updateBlockAttributes(item.innerBlocks[0].clientId, { innerParent: InnerBlocksProps });
					}
				}

			});
		}
	}

	componentDidMount() {
		this.setInnerBlocksAttributes('Mount');
	}

	componentDidUpdate(prevProps, prevState) {
		this.setInnerBlocksAttributes('Update', prevProps, prevState);
	}

	render() {
		const {
			attributes:
			{
				// uniqueID,
				slideCount,
				align,
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
				contentAnimation,
				contentAnimationDuration,
				contentAnimationDelay,
				sliderAnimationEffect,
				sliderAutoplay,
				pauseOnHover,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				sliderArrays,
				imageSize
			},
			className,
			setAttributes
		} = this.props;
		const changeState = this.changeState;
		const getState = this.getState;

		const sliderArraysParsed = JSON.parse(sliderArrays);

		const wrapperClass = classnames(className, {
			[`${className}--current-slide-${ getState('currentSlide') }`]: true,
			'alignfull': align === 'full',
			'alignwide': align === 'wide'
		});

		//Recursive iterate object value
		const deepMap = (obj, cb) => {
			var out = {};
		  
			Object.keys(obj)
		  	.forEach(function (k) {
		      var val;
		      if (obj[k] !== null && typeof obj[k] === 'object') {
		        val = deepMap(obj[k], cb);
		      } else {
		        val = cb(obj[k], k);
		      }

		      out[k] = val;
		    });
		  
		  return out;
		}

		const updateArrValues = ( value, index ) => {
			//Replace undefined to ''
			value = deepMap(value, function (v, k) {
				if (typeof v == 'undefined'){
					v = '';
				}
				return v;
			});

			const { attributes, setAttributes } = this.props;
			const { sliderArrays } = attributes;

			const sliderArraysParsed = JSON.parse(sliderArrays);

			const newItems = sliderArraysParsed.map( ( item, thisIndex ) => {
				if ( index === thisIndex ) {
					// item = jQuery.extend(true, {}, item, value);
					item = merge(item, value);
				}
				return item;
			} );

			setAttributes( {
				sliderArrays: JSON.stringify(newItems),
			} );
		};

		const renderEditTitles = ( index ) => {	
			if (typeof sliderArraysParsed[ index ] !== 'undefined')
			return (
				<Fragment>
					<li className={ `${className}__title-wrapper ${className}__title-wrapper-${ index } ${className}__title-wrapper--${ ( 1 + index === getState('currentSlide') ? 'active' : 'inactive' ) }` }>
						<span className={ `${className}__title ${className}__title-${ 1 + index } ` } onClick={ () => {
									changeState('currentSlide', 1 + index);
									changeState('selectedSlide', index);
								} 
							}>
							<RichText
								tagName="div"
								placeholder={ __( 'Slide', 'getwid' ) }
								value={ sliderArraysParsed[ index ].text ? sliderArraysParsed[ index ].text : __( 'Slide', 'getwid' ) }
								unstableOnFocus={ () => changeState('currentSlide', 1 + index) }
								onChange={ value => {
									updateArrValues( { text: value }, index );
								} }
								formattingControls={[]}
								className={`${className}__title_text`}
							/>
						</span>
					</li>
				</Fragment>
			);
		};

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

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{updateArrValues},
					...{changeState},
					...{getState}
				}} key='inspector'/>

				<div className={ wrapperClass }>
					<div className={`${className}__slides-wrapper`}>
						<ul className={`${className}__titles`}>
							<Fragment>
								{ times( slideCount, n => renderEditTitles( n ) ) }
							</Fragment>
						</ul>
						<div className={`${className}__content`}>
						
							<InnerBlocks
								template={ getPanesTemplate( slideCount ) }
								templateLock="all"
								templateInsertUpdatesSelection={false}
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