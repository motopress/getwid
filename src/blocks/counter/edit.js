/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component } = wp.element;
const { RichText, withColors, BlockControls, AlignmentToolbar } = wp.editor;

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const { textColor, setAttributes } = this.props;
		const { clientId, className, baseClass } = this.props;
		const { prefix, suffix, wrapperAlign, customTextColor } = this.props.attributes;
		
		const wrapperProps = {
			className: classnames(`${baseClass}__number`,
				{
					'has-text-color': textColor.color,
					[textColor.class]: textColor.class
				}),
			style: {
				color: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined)
			}
		};

		return [
			<BlockControls>
				<AlignmentToolbar
					value={wrapperAlign}
					onChange={(wrapperAlign) => {
						setAttributes({ wrapperAlign });
					}}
				/>
			</BlockControls>,
			<Inspector {...this.props} />,
			<div className={classnames(className, clientId)} >
				<div className={`${baseClass}__wrapper`} style={{ textAlign: wrapperAlign ? wrapperAlign : null }}>

					<RichText
						tagName='p'
						className={`${baseClass}__prefix`}
						placeholder={__('Prefix', 'getwid')}
						value={prefix ? prefix : ''}
						onChange={prefix => setAttributes({ prefix })}
						keepPlaceholderOnFocus={true}
						multiline={false}
					/>

					<span {...wrapperProps} >0</span>

					<RichText
						tagName='p'
						className={`${baseClass}__suffix`}
						placeholder={__('Suffix', 'getwid')}
						value={suffix ? suffix : ''}
						onChange={suffix => setAttributes({ suffix })}
						keepPlaceholderOnFocus={true}
						multiline={false}
					/>
				</div>
			</div>
		];
	}

	getEasingFunction = () => {
		const { easing, useEasing } = this.props.attributes;

		if ($.parseJSON(useEasing)) {
			switch (easing) {
				case 'outExpo':
					return (t, b, c, d) => {
						return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
					};
				case 'outQuintic':
					return (t, b, c, d) => {
						let ts = (t /= d) * t;
						let tc = ts * t;
						return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
					}
				case 'outCubic':
					return (t, b, c, d) => {
						let ts = (t /= d) * t;
						let tc = ts * t;
						return b + c * (tc + -3 * ts + 3 * t);
					}
			}
		} else {
			return null;
		}
	}

	getNumerals = () => {
		const { attributes: { numerals } } = this.props;
		switch (numerals) {
			case 'eastern_arabic':
				return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
			case 'farsi':
				return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
			default:
				return null;
		}
	}

	startCounter = () => {

		const { baseClass, clientId } = this.props;
		const { useEasing, useGrouping, separator } = this.props.attributes;
		const { start, end, decimalPlaces, duration, decimal } = this.props.attributes;

		const $counter = $( `.${clientId}` ).find( `.${baseClass}__number` );

		const options = {
			startVal	  : parseFloat( start 		  ),
			decimalPlaces : parseInt  ( decimalPlaces ),
			duration	  : parseInt  ( duration 	  ),

			useEasing	: $.parseJSON( useEasing   ),
			useGrouping : $.parseJSON( useGrouping ),

			separator : separator,
			decimal	  : decimal,

			easingFn: this.getEasingFunction(),
			numerals: this.getNumerals()
		}

		new CountUp($counter.get(0), parseFloat(end), options).start();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isSelected === this.props.isSelected) {

			const { className, textColor } = this.props;
			const { align, title, prefix, suffix, wrapperAlign } = this.props.attributes;

			if (!isEqual( prevProps.attributes.title, title )
				|| !isEqual( prevProps.attributes.prefix, prefix )
				|| !isEqual( prevProps.attributes.suffix, suffix ) ) {
				return;
			}

			if (!isEqual( prevProps.textColor, textColor )
				|| !isEqual( prevProps.textColor.color, textColor.color ) ) {
				return;
			}

			if (!isEqual( prevProps.className, className )
				|| !isEqual( prevProps.attributes.wrapperAlign, wrapperAlign )
				|| !isEqual( prevProps.attributes.align, align ) ) {
				return;
			}

			this.startCounter();
		}
	}

	componentDidMount() {
		const { clientId, baseClass } = this.props;
		const { isInViewport, scrollHandler } = this.props;

		const root = '.edit-post-layout__content';

		const $counter = $(`.${clientId}`).find(`.${baseClass}__number`);

		if (isInViewport($counter)) {
			this.startCounter();
		} else {
			scrollHandler(root, $counter, () => {
				this.startCounter();
			});
		}
	}
}

export default compose([
	withColors({ textColor: 'color' })
])(Edit);