import Inspector from './inspector';
import classnames from 'classnames';

import { CountUp } from 'GetwidVendor/countup.js';

const { __ } = wp.i18n;

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.startCounter 	   = this.startCounter.bind(this);
		this.getNumerals 	   = this.getNumerals.bind(this);
		this.getEasingFunction = this.getEasingFunction.bind(this);

		this.state = {
			didInput: false,
			isVisible: false,			
		}
	}

	render() {
		const {
			attributes: {
				title,
				prefix,
				suffix,

				customTextColor
			},

			clientId,
			className,

			textColor,
			setAttributes,

		} = this.props;

		const wrapperProps = {
			className: classnames(`${className}__number-wrapper`,
				{
					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}),
			style: {
				color: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),
			}
		}

		return (
			<Fragment>
				<Inspector {...this.props}/>
				<div className={classnames(className)}>
					<div className={`${className}__wrapper ${clientId}`}>

						<div className={`${className}__title-holder`}>
							<RichText
								tagName='p'
								className={`${className}__title`}
								placeholder={__('Title', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
						</div>

						

						<div {...wrapperProps}>

							<RichText
								tagName='p'
								className={`${className}__prefix`}
								placeholder={__('Prefix', 'getwid')}
								value={prefix ? prefix : ''}
								onChange={prefix => setAttributes({ prefix })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
							
							<span className={`${className}__number`}>0</span>

							<RichText
								tagName='p'
								className={`${className}__suffix`}
								placeholder={__('Suffix', 'getwid')}
								value={suffix ? suffix : ''}
								onChange={suffix => setAttributes({ suffix })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	getEasingFunction() {
		const {
			attributes: {
				easing,
				useEasing
			}
		} = this.props;

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

	getNumerals() {
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

	startCounter() {

		const {
			attributes: {
				start,
				end,
				decimalPlaces,
				duration,
				useEasing,
				useGrouping,

				separator,
				decimal,
			},
			className,
			clientId 
		} = this.props;

		const $id = $(`.${clientId}`);
		const $counter = $id.find(`.${className}__number`);

		const options = {
			startVal: 	   parseFloat(start),
			decimalPlaces: parseInt(decimalPlaces),
			duration: 	   parseInt(duration),

			useEasing:   $.parseJSON(useEasing),
			useGrouping: $.parseJSON(useGrouping),
			separator:   separator,
			decimal:     decimal,

			easingFn: this.getEasingFunction(),
			numerals: this.getNumerals()
		}

		new CountUp($counter.get(0), parseFloat(end), options).start();
	}
	
	componentDidMount() {		
		const { isVisible } = this.state;

		const {
			isInViewport,
			scrollHandler,
			clientId,
			className
			
		} = this.props;

		const $id = $(`.${clientId}`);
		const $counter = $id.find(`.${className}__number`);

		const root = '.edit-post-layout__content';

		if (!isVisible) {
			if (isInViewport($counter)) {				
				this.setState({ isVisible: true });
				this.startCounter();
			} else {
				scrollHandler(root, $counter, () => {
					this.setState({ isVisible: true });
					this.startCounter();
				});
			}
		}		
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isSelected === this.props.isSelected) {
			this.startCounter();
		}
	}
}

export default compose([
	withColors({ textColor: 'color' }),
])(Edit);