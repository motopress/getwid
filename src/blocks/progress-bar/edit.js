import Inspector from './inspector';
import classnames from 'classnames';

const { __ } = wp.i18n;

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.animate = this.animate.bind(this);
		this.showProgressBar = this.showProgressBar.bind(this);
		this.resetWidth = this.resetWidth.bind(this);
		this.showCircle = this.showCircle.bind(this);
		this.checkTypeBar = this.checkTypeBar.bind(this);

		const { attributes: { isAnimated } } = this.props;

		this.state = {
			fillComplete: !isAnimated ? true : false,
			isVisible: false,
			holderWidth: undefined
		}
	}

	render() {
		const {
			attributes: {
				fillAmount,
				customBackgroundColor,
				customTextColor,
				title
			},

			clientId,
			className,
			setAttributes,

			backgroundColor,
			textColor

		} = this.props;

		if (fillAmount === undefined) {
			setAttributes({ fillAmount: 0 });
		}

		let currentAmount = fillAmount ? fillAmount : 0;

		const { fillComplete, holderWidth } = this.state;

		const showPercent = () => {
			const { fillComplete } = this.state;
			return fillComplete ? currentAmount.toString() + '%' : null;
		}

		const wrapperHolderProps = {
			className: classnames(`${className}__content-holder`,
				{
					[`${className}__content-holder`]: !this.props.backgroundColor.color,
					'has-background': backgroundColor.color,
					[backgroundColor.class]: backgroundColor.class,
				}),
			style: { backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : customBackgroundColor }
		}

		const wrapperContentProps = {
			className: classnames(`${className}__content`,
				{
					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}),
			style: {
				backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),

				width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
			}
		}

		const isCircle = this.checkTypeBar();

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={classnames(className, {
					'ui-type-circle': isCircle,
					'ui-type-default': !isCircle
				})}>
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

							{!isCircle && (
								<span className={`${className}__percent`}>{showPercent()}</span>
							)}
						</div>

						{isCircle && (
							<div className={`${className}__circle-wrapper`}>
								<div className={`${className}__circle-background`}></div>
								<div className={`${className}__circle-foreground`}></div>
								<canvas className={`${className}__counter`} height="200" width="200" />
							</div>
						)}
						{!isCircle && (
							<div {...wrapperHolderProps}>
								<div {...wrapperContentProps}></div>
							</div>
						)}
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps) {
		const {
			attributes: {
				isAnimated,
				fillAmount,
				typeBar
			}
		} = this.props;

		if (!isAnimated) {
			this.resetWidth(fillAmount);
		}

		if (prevProps.attributes.typeBar != typeBar) {
			if (this.props.attributes.typeBar === 'default') {
				this.resetWidth();
				this.showProgressBar();
			} else {
				this.showCircle();
			}
		}

		if (typeBar !== 'default' && prevProps.attributes.fillAmount != fillAmount) {
			this.showCircle(true);
		}
	}

	componentDidMount() {
		const isCircle = this.checkTypeBar();
		if (!isCircle) {
			this.showProgressBar();
		} else {
			this.showCircle();
		}
	}

	resetWidth(percent = 0) {
		const { clientId, className } = this.props;
		$(`.${clientId}`).find(`.${className}__content`).css('width', `${percent}%`);
	}

	checkTypeBar() {
		const { attributes: { typeBar } } = this.props;
		return typeBar === undefined ? false : typeBar === 'default' ? false : true;
	}

	animate() {
		const {
			attributes: {
				fillAmount
			},
			className,

		} = this.props;

		let $progress = $(ReactDOM.findDOMNode(this));
		let $content = $(`.${className}__content`, $progress);

		const percent = () => { return Math.ceil(($content.width() / $content.parent().width()) * 100); }

		$content.animate({ width: `${fillAmount}%` }, {
			duration: 2000,
			progress: () => {
				let $percent = $(`.${className}__percent`, $progress);
				$percent.text(percent() + '%');
			},
			complete: () => {
				this.setState({
					fillComplete: true,
					holderWidth: $content.parent().width()
				});
			}
		});
	}

	showProgressBar() {
		const {
			attributes: {
				isAnimated,
				fillAmount
			},

			isInViewport,
			scrollHandler,

			className,
			clientId
		} = this.props;

		const $id = $(`.${clientId}`);
		const $bar = $id.find(`.${className}__content`);

		const root = '.edit-post-layout__content';

		if (isAnimated) {
			if (isInViewport($bar)) {
				this.animate($bar);
			} else {
				scrollHandler(root, $bar, () => {
					this.animate($bar);
				});
			}
		} else {
			$id.find(`.${className}__content`).css('width', `${fillAmount}%`);
			$id.find(`.${className}__percent`).text(`${fillAmount}%`);
		}
	}

	showCircle(changeDirectly = false) {
		const {
			attributes: {
				fillAmount,
				isAnimated
			},
			clientId,
			className

		} = this.props;

		const counter = $(`.${clientId}`).find(`.${className}__counter`).get(0).getContext('2d');

		let no = changeDirectly ? fillAmount : isAnimated ? 0 : fillAmount,
			pointToFill = 4.72,
			cw = counter.canvas.width,
			ch = counter.canvas.height,
			diff,
			fill;			

		const fillCounter = (checkStop = null) => {
			diff = ((no / 100) * Math.PI * 2 * 10);
			counter.clearRect(0, 0, cw, ch);
			counter.lineWidth = 6.1;
			counter.fillStyle = '#fff';
			counter.strokeStyle = '#ED6A5A';
			counter.textAlign = 'center';
			counter.font = "25px monospace";
			counter.fillStyle = '#4a4949';
			counter.fillText(no + '%', 100, 110);
			counter.beginPath();
			counter.arc(100, 100, 92.6, pointToFill, diff / 10 + pointToFill);
			counter.stroke();

			if (checkStop) checkStop();
		}

		if (isAnimated && !changeDirectly) {
			fill = setInterval(fillCounter.bind(null, () => {
				if (isAnimated) {
					if (no >= fillAmount) {
						clearTimeout(fill);
					}
					no++;
				}
			}), 35);
		} else {
			fillCounter();
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);