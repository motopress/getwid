/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

import { isEqual, isEmpty, get, has, set, unset, head } from 'lodash';

/**
 * Internal dependencies
 */
import { createResizeObserver } from 'GetwidUtils/help-functions';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;

const { jQuery: $ } = window;

/**
* Create an Component
*/
class GetwidRullers extends Component {

	constructor() {
		super(...arguments);

		this.draggies = {};

		this.state = {
			needRender : false
		};

		this.marginSizes = {};
		this.paddingSizes = {};

		this.sizesIsFilled = false;

		this.initDragRullers = this.initDragRullers.bind( this );
	}

	getPaddingRight() {
		const { paddingRight, paddingRightValue } = this.props;

		if ( paddingRight == '' ) {
			return parseFloat( this.paddingSizes.default );
		} else {
			return parseFloat( (paddingRight == 'custom' ? paddingRightValue :
				( paddingRight && paddingRight !='none' ? this.paddingSizes[ paddingRight ] : 0 )
			) );
		}
	}

	getPaddingLeft() {
		const { paddingLeft, paddingLeftValue } = this.props;

		if ( paddingLeft == '' ) {
			return parseFloat( this.paddingSizes.default );
		} else {
			return parseFloat( (paddingLeft == 'custom' ? paddingLeftValue :
				( paddingLeft && paddingLeft !='none' ? this.paddingSizes[ paddingLeft ] : 0 )
			) );
		}
	}

	getPaddingTop() {
		const { paddingTop, paddingTopValue } = this.props;

		if ( paddingTop == '' ) {
			return parseFloat( this.paddingSizes.default );
		} else {
			return parseFloat( (paddingTop == 'custom' ? paddingTopValue :
				( paddingTop && paddingTop !='none' ? this.paddingSizes[ paddingTop ] : 0 )
			) );
		}
	}

	getPaddingBottom() {
		const { paddingBottom, paddingBottomValue } = this.props;

		if ( paddingBottom == '' ) {
			return parseFloat( this.paddingSizes.default );
		} else {
			return parseFloat( (paddingBottom == 'custom' ? paddingBottomValue :
				( paddingBottom && paddingBottom !='none' ? this.paddingSizes[ paddingBottom ] : 0 )
			) );
		}
	}

	getMarginRight() {
		const { marginRight, marginRightValue } = this.props;

		if ( marginRight == '' ) {
			return parseFloat( this.marginSizes.default );
		} else {
			return parseFloat( (marginRight == 'custom' ? marginRightValue :
				( marginRight && marginRight !='none' ? this.marginSizes[ marginRight ] : 0 )
			) );
		}
	}

	getMarginLeft() {
		const { marginLeft, marginLeftValue } = this.props;

		if ( marginLeft == '' ) {
			return parseFloat( this.marginSizes.default );
		} else {
			return parseFloat( (marginLeft == 'custom' ? marginLeftValue :
				( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
			) );
		}
	}

	getMarginTop() {
		const { marginTop, marginTopValue } = this.props;

		if ( marginTop == '' ) {
			return parseFloat( this.marginSizes.default );
		} else {
			return parseFloat( (marginTop == 'custom' ? marginTopValue :
				( marginTop && marginTop !='none' ? this.marginSizes[ marginTop ] : 0 )
			));
		}
	}

	getMarginBottom() {
		const { marginBottom, marginBottomValue } = this.props;

		if ( marginBottom == '' ) {
			return parseFloat( this.marginSizes.default );
		} else {
			return parseFloat( (marginBottom == 'custom' ? marginBottomValue :
				( marginBottom && marginBottom !='none' ? this.marginSizes[ marginBottom ] : 0 )
			) );
		}
	}

	getOffset(position) {

		const { clientId, baseClass } = this.props;
		
		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );

		let currentWidth;
		let adjacentMargin = 0;

		if ( position == 'left' ) {
			currentWidth   = this.getPaddingLeft();
			adjacentMargin = this.getMarginLeft();
		} else if ( position == 'right' ) {
			currentWidth   = this.getPaddingRight();
			adjacentMargin = this.getMarginRight();
		}
		
		return $section.outerWidth() - currentWidth - adjacentMargin;
	}

	calculateAllowedWidth(sectionWidth, $wrapper, rullers = 'margin', position = 'left') {
		let leftMargin   = parseFloat( $wrapper.css( 'margin-left'  ) );
		let rightMargin  = parseFloat( $wrapper.css( 'margin-right' ) );
		let leftPadding  = parseFloat( $wrapper.css( 'padding-left' ) );
		let rightPadding = parseFloat( $wrapper.css( 'padding-right' ) );

		if ( rullers == 'margin' ) {
			if (position == 'left') {
				leftMargin = this.getMarginLeft();
			}
			if (position == 'right') {
				rightMargin = this.getMarginRight();
			}
		}

		if ( rullers == 'padding' ) {
			if ( position == 'left' ) {
				leftPadding = this.getPaddingLeft();
			}
			if ( position == 'right' ) {
				rightPadding = this.getPaddingRight();
			}
		}

		return sectionWidth - (leftMargin + rightMargin + leftPadding + rightPadding) - this.minWidth - 10;
	}

	initDragRullers(position = 'top', rullers = 'margin', direction = 'down') {

		const { clientId, baseClass, setAttributes, changeState } = this.props;
		const capitalizePosition = position.charAt( 0 ).toUpperCase() + position.slice( 1 );
		const capitalizeRullers = rullers.charAt( 0 ).toUpperCase() + rullers.slice( 1 );

		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` ).first();
		
		const $wrapper      = $section.children( `.${baseClass}__wrapper` );
		const $rullersArea  = $section.children( `.${baseClass}__${position}-${rullers}-area` );
		const $rullersLabel = $section.children().find( `.${baseClass}__${position}-${rullers}-label` );
		const $dragZone     = $section.children().find( `.${baseClass}__${position}-${rullers}-drag-zone` );

		if ( $dragZone.length == 0 || $rullersArea.length == 0 ) return;

		if ( Object.keys( this.draggies).length ) {
			let shouldEventAdd = true;
			let getItem = get( this.draggies, [ rullers, position ] );

			if ( getItem ) {
				if ( getItem.element.className == $dragZone[ 0 ].className ) {
					shouldEventAdd = false;
				}
			}

			if ( ! shouldEventAdd ) return;
		}		

		set(this.draggies, [ rullers, position ],
			new Draggabilly($dragZone[ 0 ], {
				containment: $rullersArea,
				axis: (position == 'top' || position == 'bottom') ? 'y' : 'x'
			})
		);

		const draggie = get( this.draggies, [ rullers, position ] );

		let blockHeight, blockWidth;
		let yOffset, prevVector;

		draggie.on( 'dragStart', event => {

			$rullersArea.addClass('active-drag-area');
			$rullersArea.removeClass('empty-ruller');
			$rullersLabel.removeClass('empty-label');

			changeState({
				isLockedPaddingsOnDesktop: false,
				isLockedMarginsOnDesktop: false
			});

			if ( position == 'top' || position == 'bottom' ) {
				blockHeight = $rullersArea.height();
			} else {
				blockWidth = $rullersArea.width();
			}
		} );

		draggie.on( 'dragMove' , (event, pointer, vector) => {

			if ( yOffset != Math.floor( vector.y ) ) {
				let leftOffset, rightOffset;

				let newHeight, newWidth;
				newWidth = $rullersArea.width();

				if ( direction == 'down' ) {
					newHeight = Math.abs( blockHeight - Math.floor( vector.y ) );
				} else if ( direction == 'up' ) {
					newHeight = Math.abs( blockHeight + Math.floor( vector.y ) );
				}

				const setVerticalRullers = () => {
					$rullersArea.height( newHeight );
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( `${capitalizeRullers} ${capitalizePosition}: ${newHeight}px` );
				};	
			
				//Variables init
				const wrapperInnerWidth = $wrapper.innerWidth();
				const wrapperOuterWidth = $section.outerWidth();
				
				/* #region Get drag Areas */
				const getSpacingArea = (spacing, position) => {
					const $spacingDraggie = get( this.draggies, [ spacing, position ] );
					return $spacingDraggie ? $spacingDraggie.$element.parent() : undefined;
				}

				const $paddingTopArea 	 = getSpacingArea( 'padding', 'top'    );
				const $paddingLeftArea   = getSpacingArea( 'padding', 'left'   );
				const $paddingRightArea  = getSpacingArea( 'padding', 'right'  );
				const $paddingBottomArea = getSpacingArea( 'padding', 'bottom' );
				const $marginTopArea     = getSpacingArea( 'margin' , 'top'    );				
				const $marginBottomArea  = getSpacingArea( 'margin' , 'bottom' );
				/* #endregion */
				
				const allowedWidth = this.calculateAllowedWidth( wrapperOuterWidth, $wrapper, rullers, position );
				const vectorWidth = Math.abs( Math.floor( vector.x ) );

				if ( typeof prevVector == 'undefined' ) {
					prevVector = Math.floor( vector.x );
				}

				//--------------Padding--------------
				if ( rullers == 'padding' ) {

					if ( position == 'top' ) {
						setVerticalRullers();

						if ( $paddingRightArea ) {
							$paddingRightArea.css({ 'top': newHeight });
						}

						if ( $paddingLeftArea ) {
							$paddingLeftArea.css({ 'top': newHeight });
						}
					} else if ( position == 'right' ) {

						const leftPadding = this.getPaddingLeft();
						const allowedWidth = wrapperInnerWidth - this.minWidth - leftPadding;
							
						const calcWidth = Math.abs( blockWidth - Math.floor( vector.x ) );
	
						if ( calcWidth <= allowedWidth ) {
							newWidth = calcWidth;

							let marginRight = 0;
							if ( has( this.draggies, [ 'margin', 'right' ] ) ) {
								marginRight = get( this.draggies, [ 'margin', 'right' ] ).$element.width();
							}
							
							leftOffset = wrapperOuterWidth - newWidth - marginRight;

							$paddingRightArea.css({ 'right' : marginRight });
							$paddingRightArea.css({ 'left' : leftOffset });
						} else {
							return;
						}
					} else if ( position == 'bottom' ) {
						setVerticalRullers();

						if ( $paddingRightArea ) {
							$paddingRightArea.css({ 'bottom': newHeight });
						}

						if ( $paddingLeftArea ) {
							$paddingLeftArea.css({ 'bottom': newHeight });
						}				
					} else if ( position == 'left' ) {
						const rightPadding = this.getPaddingRight();
						const allowedWidth = wrapperInnerWidth - this.minWidth - rightPadding;
							
						const calcWidth = Math.abs( blockWidth + Math.floor( vector.x ) );
	
						if ( calcWidth <= allowedWidth ) {
							newWidth = calcWidth;

							let marginLeft = 0;
							if ( has( this.draggies, [ 'margin', 'left' ] ) ) {
								marginLeft = get( this.draggies, [ 'margin', 'left' ] ).$element.width();
							}
							
							rightOffset = wrapperOuterWidth - newWidth - marginLeft;

							$paddingLeftArea.css({ 'left' : marginLeft });
							$paddingLeftArea.css({ 'right' : rightOffset });	
						} else {
							return;
						}
					}
				}

				//--------------Margin--------------
				if ( rullers == 'margin' ) {

					if ( position == 'top' ) {
						setVerticalRullers();
					} else if ( position == 'right' ) {
						const rightMargin  = this.getMarginRight();
						const calcWidth = Math.abs( blockWidth - Math.floor( vector.x ) );

						const setMarginRight = () => {
							newWidth = calcWidth;
							const leftOffset = wrapperOuterWidth - this.getPaddingRight() - newWidth;
							$.each([ $paddingTopArea, $paddingRightArea, $paddingBottomArea, $marginTopArea, $marginBottomArea ], (index, item) => { 
								if ( item ) item.css({ 'right': newWidth });
							});
							if ( $paddingRightArea ) $paddingRightArea.css({ 'left' : leftOffset });
						};

						if ( prevVector > Math.floor( vector.x ) ) {

							if ( vectorWidth <= allowedWidth ) {
								setMarginRight();
							} else {
								return;
							}
							
						} else {
							if ( calcWidth < (allowedWidth + rightMargin) ) {
								setMarginRight();
							}
						}
						prevVector = Math.floor( vector.x );

						$rullersArea.width( newWidth );
					} else if ( position == 'bottom' ) {
						setVerticalRullers();
					} else if ( position == 'left' ) {
						const leftMargin   = this.getMarginLeft();
						const calcWidth = Math.abs( blockWidth + Math.floor( vector.x ) );

						const setMarginLeft = () => {
							newWidth = calcWidth;
							const rightOffset = wrapperOuterWidth - this.getPaddingLeft() - newWidth;
							$.each( [ $paddingTopArea, $paddingLeftArea, $paddingBottomArea, $marginTopArea, $marginBottomArea], (index, item) => { 
								if ( item ) item.css({ 'left': newWidth });
							});
							if ( $paddingLeftArea ) $paddingLeftArea.css({ 'right' : rightOffset });
						};

						if ( prevVector < Math.floor( vector.x ) ) {

							if ( vectorWidth <= allowedWidth ) {
								setMarginLeft();
							} else {
								return;
							}
						} else {
							if ( calcWidth < (allowedWidth + leftMargin) ) {
								setMarginLeft();
							}
						}
						prevVector = Math.floor( vector.x );

						$rullersArea.width( newWidth );
					}
				}

				if ( position == 'right' || position == 'left' ) {
					if (newWidth < 100){
						$rullersLabel.addClass('label-corner');
					} else {
						$rullersLabel.removeClass('label-corner');
					}					
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( `${capitalizeRullers} ${capitalizePosition}: ${newWidth}px` );
				}

				$wrapper.css({ [ rullers + capitalizePosition ]: (position == 'top' || position == 'bottom') ? newHeight : newWidth });
			}

			if ( position == 'top' || position == 'bottom' ) {
				yOffset = Math.floor( vector.y );
			}
		});

		draggie.on( 'dragEnd', () => {

			$rullersArea.removeClass( 'active-drag-area' );
			
			setAttributes({
				[ rullers + capitalizePosition ] : 'custom',
				[ rullers + capitalizePosition + 'Value' ] : (position == 'top' || position == 'bottom') ? $rullersArea.height() + 'px' : $rullersArea.width() + 'px'
			});
		});
	}

	initDraggies() {
		const { isLayoutSet } = this.props;

		if ( isLayoutSet ) {
			const { initDragRullers } = this;

			//Top
			initDragRullers( 'top'   , 'margin' , 'up' );
			initDragRullers( 'top'   , 'padding', 'up' );
			
			//Right
			initDragRullers( 'right' , 'margin'  , 'left' );
			initDragRullers( 'right' , 'padding' , 'left' );

			//Bottom
			initDragRullers( 'bottom', 'margin' , 'up' );
			initDragRullers( 'bottom', 'padding', 'up' );

			//Left
			initDragRullers( 'left'  , 'margin'  , 'right' );
			initDragRullers( 'left'  , 'padding' , 'right' );

			// console.log( this.draggies );

			// debugger;
		}
	}	

	dropDraggies() {

		const spacing   = [ 'margin', 'padding' ];
		const direction = [ 'top', 'right', 'bottom', 'left' ];

		$.each( spacing, (index, spacings) => {
			$.each( direction, (index, directions) => {
				const draggie = get( this.draggies, [ spacings, directions ] );
				if ( draggie ) {
					draggie.destroy();
				}
			} );
		} );
		this.draggies = {};

		console.log( this.props.clientId );
	}

	checkDisabledRuller() {

		const { paddingTop, paddingBottom, paddingLeft, paddingRight } = this.props;
		const { marginTop, marginBottom, marginLeft, marginRight } = this.props;

		const paddingValues = {
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight
		};

		const marginValues = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};		

		const unsetDraggie = (spacingValues, spacing) => {
			$.each( spacingValues, (name, value) => {
				if ( value == 'none' ) {
					const position = name.replace( spacing, '' ).toLowerCase();
					const draggie = get( this.draggies, [ spacing, position ] );
					if ( draggie ) {
						draggie.destroy();
					}
					unset( this.draggies, [ spacing, position ] );
				}
			} );
		}

		unsetDraggie( paddingValues, 'padding' );
		unsetDraggie( marginValues , 'margin'  );
	}

	initSizes() {
		const { baseClass, clientId } = this.props;
		const $block = $( `#block-${clientId}` );

		const $section = $block.find( `.${baseClass}` );
		const $wrapper = $block.find( `.${baseClass}__wrapper` );

		//Arrays
		const spacings = [ 'padding', 'margin' ];
		const rullers  = [ 'top', 'right', 'bottom', 'left' ];
		const sizes    = [ 'small', 'medium', 'normal', 'large' ];

		const reRender = () => {
			this.setState({ needRender: ! this.state.needRender });
		};

		$.each(spacings, (index, spacingsItem) => {
			$.each(rullers, (index, rullersItem) => {
				$.each(sizes, (index, sizesItem) => {
					
					const elClass = `getwid-${spacingsItem}-${rullersItem}-${sizesItem}`;

					const checkStyle = checkObj => {
						if ( ! has( checkObj, [ sizesItem ] ) ) {
							const style = $(`.${elClass}`).css( `${spacingsItem}-${rullersItem}` );
							set( checkObj, [ sizesItem ], style );
							reRender();
						}
					};

					if ( spacingsItem == 'padding' ) {
						if ( $wrapper.hasClass( elClass ) ) {
							checkStyle(this.paddingSizes);
						}
					} else if ( spacingsItem == 'margin' ) {
						if ( [ 'top', 'bottom' ].includes( rullersItem ) ) {
							if ( $section.hasClass( elClass ) ) {
								checkStyle( this.marginSizes );
							}
						} else if ( [ 'left', 'right' ].includes( rullersItem ) ) {
							if ( $wrapper.hasClass( elClass ) ) {
								checkStyle( this.marginSizes );
							}
						}
					}
				});
			});
		});		

		this.initDefaultSizes( $section, $wrapper, reRender );

		//Check fill all values margin & padding
		let allFilled = true;
		$.each(sizes, (index, sizesObjItem) => {
			if ( ! has( this.paddingSizes, [ sizesObjItem ] ) || ! has( this.marginSizes, [ sizesObjItem ] ) ) {
				allFilled = false;
			}
		});

		if ( allFilled ) {
			this.sizesIsFilled = true;
		}
	}

	initDefaultSizes($section, $wrapper, reRender) {
		
		const { paddingRight, paddingLeft, paddingTop, paddingBottom } = this.props;
		const { marginRight, marginLeft, marginTop, marginBottom } = this.props;

		const spacings = {
			paddingRight,
			paddingLeft,
			paddingTop,
			paddingBottom,

			marginRight,
			marginLeft,
			marginTop,
			marginBottom
		}

		$.each( Object.keys( spacings ), (index, spacingsItem) => {
			if ( spacings[ spacingsItem ] == '' ) {

				const spacing  = head( spacingsItem.split( head( spacingsItem.match( /[A-Z]/g ) ) ) );
				const position = spacingsItem.replace( spacing, '' ).toLowerCase();

				const checkStyle = (spacings, $element) => {
					if ( ! has( spacings, [ 'default' ] ) ) {
						set( spacings, [ 'default' ], $element.css( `${spacing}-${position}` ) );
						reRender();
					}
				}

				if ( spacing == 'padding' ) {
					checkStyle( this.paddingSizes, $wrapper );
				} else if ( spacing == 'margin' ) {
					switch ( position ) {
						case 'top':
						case 'bottom':
							checkStyle( this.marginSizes, $section );
							break;

						case 'left':
						case 'right':
							checkStyle( this.marginSizes, $wrapper );
							break;
					}
				}
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {

		if ( ! this.sizesIsFilled ) {
			this.waitLoadContent = setInterval(() => {
				if ( document.readyState == 'complete' ) {
					clearInterval( this.waitLoadContent );
					this.initSizes();
				}
			}, 1 );
		}

		const { isLayoutSet, clientId, baseClass } = this.props;

		if ( isLayoutSet ) {
			const $block = $( `#block-${clientId}` );

			this.minWidth = parseFloat( $block.find( `.${baseClass}__wrapper` ).css( 'min-width' ) );
		}

		const { isSelected, showRullers } = this.props;
		if ( ! isEqual( isSelected, prevProps.isSelected ) || ! isEqual( showRullers, prevProps.showRullers ) ) {
			if ( ! isSelected || ! showRullers ) {
				this.dropDraggies();
			}
		}

		if ( ! isEmpty( this.draggies ) ) {
			this.checkDisabledRuller();
		}
		
		this.initDraggies();
	}

	componentDidMount() {

		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );

		if ( ! this.sizesIsFilled ) {
			this.waitLoadContent = setInterval( () => {
				if ( document.readyState == 'complete' ) {
					clearInterval( this.waitLoadContent );
					this.initSizes();
				}
			}, 1 );
		}

		this.initDraggies();
		createResizeObserver( $section, baseClass, () => {
			if ( has( this.draggies, [ 'padding', 'right' ] ) ) {
				const leftOffset = this.getOffset( 'right' );
				const $rullersArea = get( this.draggies, [ 'padding', 'right' ] ).$element.parent();

				$rullersArea.css({ 'left': leftOffset });
			}
			
			if ( has( this.draggies, [ 'padding', 'left' ] ) ) {
				const rightOffset = this.getOffset( 'left' );
				const $rullersArea = get( this.draggies, [ 'padding', 'left' ] ).$element.parent();

				$rullersArea.css({ 'right': rightOffset });
			}
		} );
	}

	componentWillUnmount() {
		this.dropDraggies();
	}

	render() {
		const { paddingBottom, paddingRight, paddingLeft, paddingTop } = this.props;
		const { marginBottom, marginRight, marginLeft, marginTop } = this.props;

		const { paddingBottomValue, paddingRightValue, paddingLeftValue, paddingTopValue } = this.props;
		const { marginBottomValue, marginRightValue, marginLeftValue, marginTopValue } = this.props;

		const { baseClass, showRullers, isSelected } = this.props;

		return (
			<Fragment>
				{/* Margin Top */}
				{ (showRullers && isSelected && marginTop != 'none') && (
					<div
						className={classnames(
							`${baseClass}__top-margin-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( marginTop =='custom' && marginTopValue == '0px' ) || this.getMarginTop() == 0
							}
						)}
						style={{
							height: this.getMarginTop(),
							right : this.getMarginRight(),
							left  : this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__top-margin-label ${baseClass}__spacing-label`, {
									'empty-label': ( marginTop =='custom' && marginTopValue == '0px' )
								}
							)}>
								{__( 'Margin Top: ', 'getwid' )}{marginTop == 'custom' ? marginTopValue : ( marginTop == '' ? this.getMarginTop() + 'px' : this.marginSizes[ marginTop ] )}
							</div>
							<div className={`${baseClass}__top-margin-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Margin Right */}
				{ (showRullers && isSelected && marginRight != 'none') && (
					<div
						className={classnames(
							`${baseClass}__right-margin-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( marginRight =='custom' && marginRightValue == '0px' ) || this.getMarginRight() == 0
							}
						)}
						style={{
							width: this.getMarginRight()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__right-margin-label ${baseClass}__spacing-label`, {
									'empty-label': ( marginRight =='custom' && marginRightValue == '0px' ),
									'label-corner': this.getMarginRight() < 100
								}
							)}>
								{__( 'Margin Right: ', 'getwid' )}{marginRight == 'custom' ? marginRightValue : ( marginRight == '' ? this.getMarginRight() + 'px' : this.marginSizes[ marginRight ] )}
							</div>
							<div className={`${baseClass}__right-margin-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Margin Bottom */}
				{ (showRullers && isSelected && marginBottom != 'none') && (
					<div
						className={classnames(
							`${baseClass}__bottom-margin-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( marginBottom =='custom' && marginBottomValue == '0px' ) || this.getMarginBottom() == 0
							}
						)}
						style={{
							height: this.getMarginBottom(),
							right : this.getMarginRight(),
							left  : this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__bottom-margin-label ${baseClass}__spacing-label`, {
									'empty-label': ( marginBottom =='custom' && marginBottomValue == '0px' )
								}
							)}>
								{__( 'Margin Bottom: ', 'getwid' )}{marginBottom == 'custom' ? marginBottomValue : ( marginBottom == '' ? this.getMarginBottom() + 'px' : this.marginSizes[ marginBottom ] )}
							</div>
							<div className={`${baseClass}__bottom-margin-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Margin Left */}
				{ (showRullers && isSelected && marginLeft != 'none') && (
					<div
						className={classnames(
							`${baseClass}__left-margin-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( marginLeft =='custom' && marginLeftValue == '0px' )	|| this.getMarginLeft() == 0
							}
						)}
						style={{
							width: this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__left-margin-label ${baseClass}__spacing-label`, {
									'empty-label': ( marginLeft =='custom' && marginLeftValue == '0px' ),
									'label-corner': this.getMarginLeft() < 100
								}
							)}>
								{__( 'Margin Left: ', 'getwid' )}{marginLeft == 'custom' ? marginLeftValue : ( marginLeft == '' ? this.getMarginLeft() + 'px' : this.marginSizes[ marginLeft ] )}
							</div>
							<div className={`${baseClass}__left-margin-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{ this.props.children }

				{/* Padding Top */}
				{ (showRullers && isSelected && paddingTop != 'none') && (
					<div
						className={classnames(
							`${baseClass}__top-padding-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( paddingTop =='custom' && paddingTopValue == '0px' ) || this.getPaddingTop() == 0
							}
						)}
						style={{
							height: this.getPaddingTop(),
							right : this.getMarginRight(),
							left  : this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__top-padding-label ${baseClass}__spacing-label`, {
									'empty-label': (paddingTop =='custom' && paddingTopValue == '0px')
								}
							)}>
								{__( 'Padding Top: ', 'getwid' )}{paddingTop == 'custom' ? paddingTopValue : ( paddingTop == '' ? this.getPaddingTop() + 'px' : this.paddingSizes[ paddingTop ] )}
							</div>
							<div className={`${baseClass}__top-padding-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Padding Right */}
				{ (showRullers && isSelected && paddingRight != 'none') && (
					<div
						className={classnames(
							`${baseClass}__right-padding-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( paddingRight =='custom' && paddingRightValue == '0px' ) || this.getPaddingRight() == 0
							}
						)}
						style={{
							left  : this.getOffset( 'right' ),
							top   : this.getPaddingTop(),
							bottom: this.getPaddingBottom(),
							right : this.getMarginRight()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__right-padding-label ${baseClass}__spacing-label`, {
									'empty-label': (paddingRight =='custom' && paddingRightValue == '0px'),
									'label-corner': this.getPaddingRight() < 100
								}
							)}>
								{__( 'Padding Right: ', 'getwid' )}{paddingRight == 'custom' ? paddingRightValue : ( paddingRight == '' ? this.getPaddingRight() + 'px' : this.paddingSizes[ paddingRight ] )}
							</div>
							<div className={`${baseClass}__right-padding-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Padding Bottom */}
				{ (showRullers && isSelected && paddingBottom != 'none') && (
					<div
						className={classnames(
							`${baseClass}__bottom-padding-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( paddingBottom =='custom' && paddingBottomValue == '0px' ) || this.getPaddingBottom() == 0
							}
						)}	
						style={{
							height: this.getPaddingBottom(),
							right : this.getMarginRight(),
							left  : this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__bottom-padding-label ${baseClass}__spacing-label`, {
									'empty-label': ( paddingBottom =='custom' && paddingBottomValue == '0px' )
								}
							)}>
								{__( 'Padding Bottom: ', 'getwid' )}{paddingBottom == 'custom' ? paddingBottomValue : ( paddingBottom == '' ? this.getPaddingBottom() + 'px' : this.paddingSizes[ paddingBottom ] )}
							</div>
							<div className={`${baseClass}__bottom-padding-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}

				{/* Padding Left */}
				{ (showRullers && isSelected && paddingLeft != 'none') && (
					<div
						className={classnames(
							`${baseClass}__left-padding-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': ( paddingLeft =='custom' && paddingLeftValue == '0px' ) || this.getPaddingLeft() == 0
							}
						)}	
						style={{
							right : this.getOffset( 'left' ),
							top   : this.getPaddingTop(),
							bottom: this.getPaddingBottom(),
							left  : this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__left-padding-label ${baseClass}__spacing-label`, {
									'empty-label': (paddingLeft =='custom' && paddingLeftValue == '0px'),
									'label-corner': this.getPaddingLeft() < 100
								}
							)}>
								{__( 'Padding Left: ', 'getwid' )}{paddingLeft == 'custom' ? paddingLeftValue : ( paddingLeft == '' ? this.getPaddingLeft() + 'px' : this.paddingSizes[ paddingLeft ] )}
							</div>
							<div className={`${baseClass}__left-padding-drag-zone ${baseClass}__spacing-drag-zone`}></div>
						</Fragment>
					</div>
				)}
			</Fragment>
		);
	}
}

export default GetwidRullers;