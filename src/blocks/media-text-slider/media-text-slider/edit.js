import classnames from 'classnames';
import memize from 'memize';
import Inspector from './inspector';
import {
	times,
	map,
	merge
} from "lodash";

import './editor.scss';

import MyBlockContext from './../context';

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
} = wp.components;

// const MyBlockContext = wp.element.createContext();

const { __, sprintf } = wp.i18n;

const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide' ];

const getPanesTemplate = memize( ( panes, props ) => {
	return times( panes, n => [ 'getwid/media-text-slider-slide', { id: n + 1, parent: [props] } ] );
} );

class Edit extends Component {
	constructor( props ) {
		console.error(props);

		super( ...arguments );	
	}

	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}

	componentDidUpdate(prevProps) {
		console.log(this.props);
		/*const {
			select,
			dispatch
		} = window.wp.data;
		console.log('++++++++++++++++++++HERE WE GO++++++++++++++++++++');
		const innerBlocks = select('core/editor').getBlocksByClientId(this.props.clientId)[0].innerBlocks;

		//Add parent attributes to children nodes
		jQuery.each(innerBlocks, function(index, item) {
			dispatch('core/editor').updateBlockAttributes(item.clientId, { parent: [this.props] });
		});
*/
	}

	render() {
		const {
			attributes:
			{
				uniqueID,
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
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				currentSlide,
				selectedSlide,
				sliderArrays,
			},
			className,
			setAttributes
		} = this.props;

		const wrapperClass = classnames(className, {
				[`${className}--current-slide-${ currentSlide }`]: true,
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

			console.warn(value);
			//Replace undefined to ''
			value = deepMap(value, function (v, k) {
				if (typeof v == 'undefined'){
					v = '';
				}
				return v;
			});

			console.error(value);
			

			console.log('updateArrValues FUNC');
			const { attributes, setAttributes } = this.props;
			const { sliderArrays } = attributes;

			const newItems = sliderArrays.map( ( item, thisIndex ) => {
				if ( index === thisIndex ) {
					// item = jQuery.extend(true, {}, item, value);
					item = merge(item, value);
					console.log(item);
				}
				return item;
			} );

			console.warn(newItems);

			setAttributes( {
				sliderArrays: newItems,
			} );
		};

		const renderEditTitles = ( index ) => {	
			if (typeof sliderArrays[ index ] !== 'undefined')
			return (
				<Fragment>
					<li className={ `${className}__title-wrapper ${className}__title-wrapper-${ index } ${className}__title-wrapper--${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
						<span className={ `${className}__title ${className}__title-${ 1 + index } ` } onClick={ () => {
									setAttributes({currentSlide: 1 + index });
									setAttributes({selectedSlide: index});
									console.log(selectedSlide);
								} 
							}>
							<RichText
								tagName="div"
								placeholder={ __( 'Tab Title' ) }
								value={ sliderArrays[ index ].text }
								unstableOnFocus={ () => setAttributes( { currentSlide: 1 + index } ) }
								onChange={ value => {
									updateArrValues( { text: value }, index );
								} }
								formattingControls={[]}
								className={`${className}__title_text`}
								keepPlaceholderOnFocus
							/>
						</span>
					</li>
				</Fragment>
			);
		};

	

		return (
			<Fragment>
				<Inspector {...{ ...this.props, ...{updateArrValues} }} key='inspector'/>

				<div className={ wrapperClass }>
					<div className={`${className}__slides-wrapper`}>
						<ul className={`${className}__titles`}>
							<Fragment>
								{ times( slideCount, n => renderEditTitles( n ) ) }
							</Fragment>
						</ul>
						<div className={`${className}__content`}>



						<MyBlockContext.Provider value={ 'hello' /* or some other value */ }>
							<InnerBlocks
								template={ getPanesTemplate( slideCount, this.props ) }
								templateLock="all"
								allowedBlocks={ ALLOWED_BLOCKS }
							/>
						</MyBlockContext.Provider>




						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default ( Edit );