import Inspector from './inspector';
import classnames from 'classnames';

import CountUp from  'countup';
import 'waypoints/lib/noframework.waypoints.js';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const { compose } = wp.compose;
const { withSelect } = wp.data;

const { RichText } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.startCounter = this.startCounter.bind(this);
		this.getNumerals = this.getNumerals.bind(this);
		this.handleStateChange = this.handleStateChange.bind(this);

		this.state = {
			didInput: false,			
		}
	}

	render() {
		const {
			attributes: {
				title,
				prefix,
				suffix
			},

			clientId,
			className,

			setAttributes,

		} = this.props;



		return (
			<Fragment>
				<Inspector {...this.props} onStateChange={this.handleStateChange}/>
				<div className={classnames(className)}>
					<div className={`${className}__wrapper ${clientId}`}>

						<div className={`${className}__title-holder`}>
							<RichText
								tagName="h5"
								className={`${className}__title`}
								placeholder={__('Enter title here...', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
						</div>

						<div className={`${className}__number-wrapper`}>
							<span className={`${className}__prefix`} >{prefix} </span>
							<span className={`${className}__number`}>0</span>
							<span className={`${className}__suffix`}> {suffix}</span>
						</div>
					</div>
				</div>
			</Fragment>
		);
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

	componentDidUpdate() {
		console.log('did update');

		this.startCounter();
	}

	startCounter() {		

		const {
			attributes: {
				start,
				end,
				decimalPlaces,
				duration
			},
			className,
			clientId 
		} = this.props;

		console.log(start);
		// console.log(end);
		// console.log(decimalPlaces);
		// console.log(duration);

		console.log(this.getNumerals());

		const $clientId = $(`.${clientId}`);
		const $counter = $clientId.find(`.${className}__number`);

		const options = {
			useEasing: false,
			useGrouping: false,
			separator: '',
			decimal: '',
			easingFn: null,
			formattingFn: null,

			numerals: this.getNumerals()
		}

		new CountUp($counter.get(0),
			parseInt(start),
			parseInt(end),
			parseInt(decimalPlaces),
			parseInt(duration),
			options
		).start();
	}

	handleStateChange() {
		debugger;
		this.setState({
			didInput: true,
		});	
	}

	componentDidMount() {
		this.startCounter();
	}
}

export default Edit;