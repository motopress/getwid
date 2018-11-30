import times from 'lodash/times';
import map from 'lodash/map';
import merge from 'lodash/merge';
import classnames from 'classnames';
import memize from 'memize';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import Inspector from './inspector';

// import ItemsAttributeManager from 'GetwidUtils/items-attribute-utils';

import './editor.scss';

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

const { __, sprintf } = wp.i18n;

const ALLOWED_BLOCKS = [ 'getwid/slide' ];

const getPanesTemplate = memize( ( panes ) => {
	return times( panes, n => [ 'getwid/slide', { id: n + 1 } ] );
} );

class Edit extends Component {
	constructor() {
		super( ...arguments );

		const {
			attributes: {
				currentSlide,
				sliderArrays
			}
		} = this.props;

		// this.onDeleteTab = this.onDeleteTab.bind(this);
		// this.updateArrValues = this.updateArrValues.bind(this);

		// this.itemsManager = new ItemsAttributeManager(sliderArrays);

		this.state = {
			selectedSlide: currentSlide !== undefined ? currentSlide - 1 : (items.length ? 0 : null),
		};		
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




	/**
	 * Retrieve toolbar dropdown slide controls
	 *
	 * @return {*[]}
	 */
	getSliderDropdown() {

		const {selectedSlide} = this.state;

		const {
			attributes: {
				sliderArrays
			}
		} = this.props;

		return [
			{
				icon: 'table-col-before',
				title: __('Add Slide Before', 'getwid'),
				isDisabled: selectedSlide === null,
				// onClick: this.onInsertSlideBefore,
			},
			{
				icon: 'table-col-after',
				title: __('Add Slide After', 'getwid'),
				isDisabled: selectedSlide === null,
				// onClick: this.onInsertSlideAfter,
			},
			{
				icon: 'arrow-left-alt2',
				title: __('Move Slide Left', 'getwid'),
				isDisabled: selectedSlide === null || selectedSlide === 0,
				// onClick: this.onMoveSlideLeft,
			},
			{
				icon: 'arrow-right-alt2',
				title: __('Move Slide Right', 'getwid'),
				isDisabled: selectedSlide === null || selectedSlide === sliderArrays.length - 1,
				// onClick: this.onMoveSlideRight,
			},
			{
				icon: 'admin-page',
				title: __('Duplicate Slide', 'getwid'),
				isDisabled: selectedSlide === null,
				// onClick: this.onDuplicate,
			},
			{
				icon: 'trash',
				title: __('Delete Slide', 'getwid'),
				isDisabled: selectedSlide === null,
				onClick: () => {
					this.onDeleteSlide();
				}
			},
		];
	}

	onDeleteSlide() {
		const {selectedSlide} = this.state;
		const {
			attributes:{
				sliderArrays
			},
			setAttributes
		} = this.props;

		console.log(this.props);

		console.log(selectedSlide);
		console.log('HERE WE GO');



		// console.log('updateArrValues FUNC');

		// const { sliderArrays } = attributes;

		console.log(sliderArrays);

/*		const newItems = sliderArrays.map( ( item, thisIndex ) => {
			if ( selectedSlide != thisIndex ) {
				item = { ...item };
			}
			return item;
		} );*/
		const newItems = sliderArrays.filter((item, idx) => idx !== selectedSlide);

		console.info(newItems);

		setAttributes( {
			slideCount : newItems.length,
			sliderArrays: newItems,
		} );


/*		if (selectedSlide === null) {
			return;
		}

		const {
			attributes: {
				items,
				active
			}
		} = this.props;

		const {attributes, setAttributes} = this.props;

		const changed = this.itemsManager.deleteItem(attributes, {index: selectedSlide});

		// Reset active attribute if it greater than items count
		if (active >= items.length - 1) {
			changed['active'] = undefined;
		}

		setAttributes(changed);

		// If removing last item then reset selectedSlide
		if (items.length === 1) {
			this.setState({selectedSlide: null});
		}*/
	}

	render() {
		const {
			attributes:
			{
				uniqueID,
				slideCount,
				blockAlignment,
				currentSlide,
				sliderArrays,
				slideAlignment,
				iSize
			},
			className,
			setAttributes
		} = this.props;
		const {selectedSlide} = this.state;
/*		console.info(this.props);
		console.log('------------');*/

		const wrapperClass = classnames( className, [`${className}--current-slide-${ currentSlide }`] );

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
			// console.warn('renderEditTitles from EDIT.JS');
			// <li className={ `${className}__slides-wrapper--slides-titles-item ${className}__slides-wrapper--slides-titles-item-${ index } kt-tabs-svg-show-${ ( ! titles[ index ].onlyIcon ? 'always' : 'only' ) } kt-tabs-icon-side-${ ( titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) } kt-tab-title-${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
			return (
				<Fragment>
					<li className={ `${className}__title-wrapper ${className}__title-wrapper-${ index } ${className}__title-wrapper--${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
						<span className={ `${className}__title ${className}__title-${ 1 + index } ` } onClick={ () => {
									setAttributes({currentSlide: 1 + index });
									this.setState({selectedSlide: index});
									console.log(this.state);
								} 
							}>
							{ sliderArrays[ index ].icon && 'right' !== sliderArrays[ index ].iconSide && (
								<i className={ `${ sliderArrays[ index ].icon } icon-side-${ sliderArrays[ index ].iconSide }` } style={{ fontSize: iSize }}></i>
								)
							}
							<RichText
								tagName="div"
								placeholder={ __( 'Tab Title' ) }
								value={ sliderArrays[ index ].text }
								unstableOnFocus={ () => setAttributes( { currentSlide: 1 + index } ) }
								onChange={ value => {
									updateArrValues( { text: value }, index );
								} }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={`${className}__title_text`}
								keepPlaceholderOnFocus
							/>
							{ sliderArrays[ index ].icon && 'right' === sliderArrays[ index ].iconSide && (
								<i className={ `${ sliderArrays[ index ].icon } icon-side-${ sliderArrays[ index ].iconSide }` } style={{ fontSize: iSize }}></i>
								)
							}
						</span>
					</li>
				</Fragment>
			);
		};

		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						{/*{`Selected Tab: ${this.state.selectedSlide}`}*/}
						<DropdownMenu
							icon="images-alt2"
							label={__('Edit Tabs', 'getwid')}
							controls={this.getSliderDropdown()}
						/>
					</Toolbar>				
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<AlignmentToolbar
						value={ slideAlignment }
						onChange={ ( nextAlign ) => {
							setAttributes( { slideAlignment: nextAlign } );
						} }
					/>
				</BlockControls>
				<Inspector {...{ ...this.props, ...{updateArrValues} }} key='inspector'/>





				<div className={ wrapperClass } >
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
								allowedBlocks={ ALLOWED_BLOCKS } />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
export default ( Edit );
