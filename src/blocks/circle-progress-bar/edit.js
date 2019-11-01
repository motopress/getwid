/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual } from 'lodash';
import { isInViewport, scrollHandler } from 'GetwidUtils/help-functions';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { BlockControls, AlignmentToolbar } = wp.editor;

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.getConfig       = this.getConfig.bind(this);
		this.drawAnimatedArcs = this.drawAnimatedArcs.bind(this);

		this.drawArcs 	  = this.drawArcs.bind(this);
		this.getThickness = this.getThickness.bind(this);
		this.setSize 	  = this.setSize.bind(this);
	}

	getConfig() {
		const { attributes: { size, backgroundColor, textColor }, clientId } = this.props;
		const { baseClass } = this.props;

		return {
			context: $( `.${clientId}` ).find( `.${baseClass}__canvas` )[ 0 ].getContext( '2d' ),

			backgroundColor: backgroundColor ? backgroundColor : '#eeeeee',
			textColor : textColor ? textColor : '#0000ee',

			radius: parseFloat( size ) / 2,
			angle : -90 * ( Math.PI / 180 )
		}
	}

	draw() {
		const { clientId, baseClass } = this.props;
		const { isAnimated, fillAmount } = this.props.attributes;

		const root = '.edit-post-layout__content';

		if ( $.parseJSON( isAnimated ) ) {
			const $bar = $( `.${clientId}` ).find( `.${baseClass}__wrapper` );
			if ( isInViewport( $bar ) ) {
				this.drawAnimatedArcs();
			} else {
				scrollHandler(root, $bar, () => {
					this.drawAnimatedArcs();
				});
			}
		} else {
			this.drawArcs( fillAmount );
		}
	}

	drawArcs(value) {
		const { size } = this.props.attributes;

		const config = this.getConfig();

		const context = config.context,
			radius  = config.radius,
			angle   = config.angle,

			backgroundColor = config.backgroundColor,
			textColor 		= config.textColor,
			thickness = parseInt( this.getThickness() );

		this.setSize();
		context.clearRect(0, 0, parseFloat( size ), parseFloat( size ) );

		context.beginPath();
		context.arc(radius, radius, radius - thickness / 2, angle, angle + Math.PI * 2);
		context.lineWidth = thickness;
		context.strokeStyle = backgroundColor;
		context.stroke();

		context.beginPath();
		context.arc(radius, radius, radius - thickness / 2, angle, angle + Math.PI * 2 * (value / 100));

		context.lineWidth = thickness;
		context.strokeStyle = textColor;
		context.stroke();

		context.beginPath();
		context.textAlign = 'center';
		context.font = '16px serif';
		context.fillText(value + '%', radius + 6.5, radius + 5);
		context.stroke();
	}

	drawAnimatedArcs() {
		const { fillAmount } = this.props.attributes;
		let value = 0;
		this.fill = setInterval(() => {
			this.drawArcs( value );

			value++;
			if ( value > fillAmount ) {
				clearInterval( this.fill );
			}
		}, 35);
	}

	getThickness() {
		const { thickness, size } = this.props.attributes;
		return $.isNumeric( thickness ) ? thickness : size / 14;
	}

	setSize() {
		const { attributes: { size }, clientId, baseClass } = this.props;
		const canvas = $( `.${clientId}` ).find( `.${baseClass}__canvas` )[0];

		canvas.width  = parseFloat( size );
		canvas.height = parseFloat( size );
	}

	componentDidUpdate(prevProps, prevState) {

		if ( prevProps.isSelected === this.props.isSelected ) {
			const { attributes: { fillAmount } } = this.props;

			if ( !isEqual( prevProps, this.props ) ) {
				this.drawArcs( fillAmount );
			}
		}
	}

	componentDidMount() {
		this.draw();
	}

	componentWillUnmount() {
		clearInterval(this.fill);
	}

	render() {
		const { wrapperAlign } = this.props.attributes;
		const { setAttributes, clientId, className, baseClass } = this.props;

		return (
			[
				<BlockControls>
					<AlignmentToolbar
						value={wrapperAlign}
						onChange={(wrapperAlign) => {
							setAttributes( { wrapperAlign } );
						}}
					/>
				</BlockControls>,
				<Inspector {...this.props} />,
				<Fragment>
					<div className={classnames( className, clientId )}>
						<div className={`${baseClass}__wrapper`} style={{ textAlign: wrapperAlign ? wrapperAlign : null }}>
							<canvas className={`${baseClass}__canvas`}/>
						</div>
					</div>
				</Fragment>
			]
		);
	}
}

export default Edit;