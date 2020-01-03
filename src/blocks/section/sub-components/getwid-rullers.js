/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

import { isEqual, get, has, set, unset } from 'lodash';

/**
 * Internal dependencies
 */
import { createResizeObserver } from 'GetwidUtils/help-functions';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;

const {jQuery: $} = window;

/**
* Create an Component
*/
class GetwidRullers extends Component {

	constructor() {
		super(...arguments);

		this.draggies = {};

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

		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );
		
		const $wrapper      = $block.find( `.${baseClass}__wrapper` );
		const $dragZone     = $block.find( `.${baseClass}__${position}-${rullers}-drag-zone` );
		const $rullersArea  = $block.find( `.${baseClass}__${position}-${rullers}-area` );
		const $rullersLabel = $block.find( `.${baseClass}__${position}-${rullers}-label` );

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

				const TopBottomRullers = () => {
					$rullersArea.height( newHeight );
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( newHeight + 'px' );
				};	
			
				//Variables init
				const wrapperInnerWidth = $wrapper.innerWidth();
				const wrapperOuterWidth = $section.outerWidth();
				
				/* #region Drag Areas */
				const $paddingTopDraggie = get( this.draggies, [ 'padding', 'top' ] );
				const $paddingTopArea = $paddingTopDraggie ? $paddingTopDraggie.$element.parent() : undefined;

				const $marginTopDraggie = get( this.draggies, [ 'margin', 'top' ] );
				const $marginTopArea = $marginTopDraggie ? $marginTopDraggie.$element.parent() : undefined;

				const $paddindLeftDraggie = get( this.draggies, [ 'padding', 'left' ] );
				const $paddingLeftArea = $paddindLeftDraggie ? $paddindLeftDraggie.$element.parent() : undefined;

				const $paddingRightDraggie = get( this.draggies, [ 'padding', 'right' ] );
				const $paddingRightArea = $paddingRightDraggie ? $paddingRightDraggie.$element.parent() : undefined;

				const $paddingBottomDraggie = get( this.draggies, [ 'padding', 'bottom' ] );
				const $paddingBottomArea = $paddingBottomDraggie ? $paddingBottomDraggie.$element.parent() : undefined;

				const $marginBottomDraggie = get( this.draggies, [ 'margin', 'bottom' ] );
				const $marginBottomArea = $marginBottomDraggie ? $marginBottomDraggie.$element.parent() : undefined;
				/* #endregion */
				
				const allowedWidth = this.calculateAllowedWidth(wrapperOuterWidth, $wrapper, rullers, position);
				const vectorWidth = Math.abs( Math.floor( vector.x ) );

				if ( typeof prevVector == 'undefined' ) {
					prevVector = Math.floor( vector.x );
				}

				//--------------Padding--------------
				if ( rullers == 'padding' ) {

					if ( position == 'top' ) {
						TopBottomRullers();

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
						TopBottomRullers();

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
						TopBottomRullers();
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
						TopBottomRullers();
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
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( newWidth + 'px' );
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
		}
	}	

	dropDraggies(prevProps, prevState) {

		const { isSelected, showRullers } = this.props;

		const spacing   = [ 'margin', 'padding' ];
		const direction = [ 'top', 'right', 'bottom', 'left' ];
			
		if ( ! isEqual( isSelected, prevProps.isSelected ) || ! isEqual( showRullers, prevProps.showRullers ) ) {
			if ( ! isSelected || ! showRullers ) {
				$.each( spacing, (index, spacings) => {
					$.each( direction, (index, directions) => {
						const draggie = get( this.draggies, [ spacings, directions ] );
						if ( draggie ) {
							draggie.destroy();
						}
					} );
				} );
				this.draggies = {};
			}
		}

		const { paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight } = this.props;

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

		this.destroyDraggies( paddingValues, 'padding' );
		this.destroyDraggies( marginValues , 'margin'  );
	}

	destroyDraggies(spacingArr = [], spacing = 'padding') {
		$.each( spacingArr, (name, value) => {
			if ( value == 'none' ) {
				const position = name.replace( spacing, '' ).toLowerCase();
				if ( get( this.draggies, [ spacing, position ] ) ) {
					get( this.draggies, [ spacing, position ] ).destroy();
				}
				unset( this.draggies, [ spacing, position ] );
			}
		} );
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

		$.each(spacings, (index, spacingsItem) => {
			$.each(rullers, (index, rullersItem) => {
				$.each(sizes, (index, sizesItem) => {
					
					const elClass = `getwid-${spacingsItem}-${rullersItem}-${sizesItem}`;

					const checkStyle = checkObj => {
						if ( ! has( checkObj, [ sizesItem ] ) ) {
							const style = $(`.${elClass}`).css( `${spacingsItem}-${rullersItem}` );
							set( checkObj, [ sizesItem ], style );
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

		//Add default value
		const setDefaultSpasing = (spacings, $element, sizes) => {
			$.each( Object.keys( spacings ), (index, spacing) => {
				if ( spacings[ spacing ] == '' ) {
					if ( ! has( sizes, [ 'default' ] ) ) {
						set( sizes, [ 'default' ], getComputedStyle( $element[ 0 ] )[ spacing ] );
						return;
					}
				}
			} );
		}
		
		const { paddingRight, paddingLeft, paddingTop, paddingBottom } = this.props;
		const { marginRight, marginLeft, marginTop, marginBottom } = this.props;

		const paddingSpacings = {
			paddingRight,
			paddingLeft,
			paddingTop,
			paddingBottom
		};

		const horisontalMarginSpacings = {
			marginRight,
			marginLeft
		};

		const verticalMarginSpacings = {
			marginTop,
			marginBottom
		}

		setDefaultSpasing( paddingSpacings, $wrapper, this.paddingSizes );

		setDefaultSpasing( horisontalMarginSpacings , $wrapper, this.marginSizes  );
		setDefaultSpasing( verticalMarginSpacings   , $section, this.marginSizes  );

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

		this.dropDraggies( prevProps, prevState );
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
		if ( this.draggies.length ) {
			$.each( this.draggies, (index, draggie) => {
				draggie.destroy();
			} );
		}
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
								'empty-ruller': (marginTop =='custom' && marginTopValue == '0px')
							}
						)}
						style={{
							height: this.getMarginTop(),
							right: (marginRight == 'custom' ? marginRightValue:
								( marginRight && marginRight !='none' ? this.marginSizes[ marginRight ] : 0 )
							),
							left: (marginLeft == 'custom' ? marginLeftValue:
								( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
							)
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__top-margin-label ${baseClass}__spacing-label`, {
									'empty-label': !marginTop
								}
							)}>
								{marginTop == 'custom' ? marginTopValue : this.marginSizes[ marginTop ]}
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
								'empty-ruller': (marginRight =='custom' && marginRightValue == '0px')
							}
						)}					
						style={{
							width: this.getMarginRight()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__right-margin-label ${baseClass}__spacing-label`, {
									'empty-label': !marginRight
								}
							)}>
								{marginRight == 'custom' ? marginRightValue : this.marginSizes[ marginRight ]}
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
								'empty-ruller': (marginBottom =='custom' && marginBottomValue == '0px')
							}
						)}
						style={{
							height: this.getMarginBottom(),
							right: (marginRight == 'custom' ? marginRightValue:
								( marginRight && marginRight !='none' ? this.marginSizes[ marginRight ] : 0 )
							),
							left: (marginLeft == 'custom' ? marginLeftValue:
								( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
							)
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__bottom-margin-label ${baseClass}__spacing-label`, {
									'empty-label': !marginBottom
								}
							)}>
								{marginBottom == 'custom' ? marginBottomValue : this.marginSizes[ marginBottom ]}
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
								'empty-ruller': (marginLeft =='custom' && marginLeftValue == '0px')
							}
						)}
						style={{
							width: this.getMarginLeft()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__left-margin-label ${baseClass}__spacing-label`, {
									'empty-label': !marginLeft
								}
							)}>
								{marginLeft == 'custom' ? marginLeftValue : this.marginSizes[ marginLeft ]}
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
								'empty-ruller': (paddingTop =='custom' && paddingTopValue == '0px')
							}
						)}					
						style={{
							height: this.getPaddingTop(),
							right: (marginRight == 'custom' ? marginRightValue:
								( marginRight && marginRight !='none' ? this.marginSizes[ marginRight ] : 0 )
							),
							left: (marginLeft == 'custom' ? marginLeftValue:
								( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
							)
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__top-padding-label ${baseClass}__spacing-label`, {
									'empty-label': !paddingTop
								}
							)}>
								{paddingTop == 'custom' ? paddingTopValue : this.paddingSizes[ paddingTop ]}
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
							`${baseClass}__spacing-area`,
							{
								'empty-ruller': (paddingRight =='custom' && paddingRightValue == '0px')
							}
						)}												
						style={{
							left: this.getOffset( 'right' ),
							// top: (paddingTop != 'none' && paddingTop ? (
							// 		paddingTop != 'custom' ? this.paddingSizes[ paddingTop ] : (
							// 			paddingTopValue ? paddingTopValue : 0
							// 		)
							// 	) : 0
							// ),
							top: this.getPaddingTop(),
							// bottom: (paddingBottom != 'none' && paddingBottom ? (
							// 		paddingBottom != 'custom' ? this.paddingSizes[ paddingBottom ] : (
							// 			paddingBottomValue ? paddingBottomValue : 0
							// 		)
							// 	) : 0
							// ),
							bottom: this.getMarginBottom(),
							right : this.getMarginRight()
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__right-padding-label ${baseClass}__spacing-label`, {
									'empty-label': !paddingRight
								}
							)}>
								{paddingRight == 'custom' ? paddingRightValue : this.paddingSizes[ paddingRight ]}
							</div>
							<div className={`${baseClass}__right-padding-drag-zone ${baseClass}__spacing-drag-zone`}></div>
							<div className={`${baseClass}__right-padding-drag-marker`}></div>
						</Fragment>
					</div>
				)}

				{/* Padding Bottom */}
				{ (showRullers && isSelected && paddingBottom != 'none') && (
					<div
						className={classnames(
							`${baseClass}__bottom-padding-area`,
							`${baseClass}__spacing-area`, {
								'empty-ruller': (paddingBottom =='custom' && paddingBottomValue == '0px')
							}
						)}	
						style={{
							height: this.getPaddingBottom(),
							right: (marginRight == 'custom' ? marginRightValue:
								(marginRight && marginRight !='none' ? this.marginSizes[ marginRight ] : 0)
							),
							left: (marginLeft == 'custom' ? marginLeftValue:
								( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
							)
						}}
					>
						<Fragment>
							<div className={classnames(
								`${baseClass}__bottom-padding-label ${baseClass}__spacing-label`, {
									'empty-label': !paddingBottom
								}
							)}>
								{paddingBottom == 'custom' ? paddingBottomValue : this.paddingSizes[ paddingBottom ]}
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
								'empty-ruller': (paddingLeft =='custom' && paddingLeftValue == '0px')
							}
						)}	
						style={{
							right: this.getOffset( 'left' ),
							top: (paddingTop != 'none' && paddingTop ? (
									paddingTop != 'custom' ? this.paddingSizes[ paddingTop ] : (
										paddingTopValue ? paddingTopValue : 0
									)
								) : 0
							),
							bottom: (paddingBottom != 'none' && paddingBottom ? (
									paddingBottom != 'custom' ? this.paddingSizes[ paddingBottom ] : (
										paddingBottomValue ? paddingBottomValue : 0
									)
								) : 0
							),
							left: (marginLeft == 'custom' ? marginLeftValue :
								( marginLeft && marginLeft !='none' ? this.marginSizes[ marginLeft ] : 0 )
							)
						}}
					>
						<Fragment>			
							<div className={classnames(
								`${baseClass}__left-padding-label ${baseClass}__spacing-label`, {
									'empty-label': !paddingLeft
								}
							)}>
								{paddingLeft == 'custom' ? paddingLeftValue : this.paddingSizes[ paddingLeft ]}
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