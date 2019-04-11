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
		this.showDefaultBar = this.showDefaultBar.bind(this);
		this.resetWidth = this.resetWidth.bind(this);
		this.showCircleBar = this.showCircleBar.bind(this);
		this.checkTypeBar = this.checkTypeBar.bind(this);
		this.tempMethod = this.tempMethod.bind(this);

		const { attributes: { isAnimated } } = this.props;

		this.state = {
			fillComplete: !isAnimated ? true : false,
			isVisible: false,
			holderWidth: undefined,
			withoutAnim: false
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

		let currentAmount = fillAmount ? parseInt(fillAmount) : 0;

		const { fillComplete, holderWidth } = this.state;

		const showPercent = () => {
			const { fillComplete } = this.state;
			return fillComplete ? currentAmount.toString() + '%' : null;
		}

		const isCircle = this.checkTypeBar();

		const wrapperProps = {
			className: classnames(className,
				{
					'ui-type-circle': isCircle,
					'ui-type-default': !isCircle,

					'has-background': backgroundColor.color,
					[backgroundColor.class]: backgroundColor.class,

					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}, clientId),
		}

		const contentWrapperPropds = {
			className: classnames(`${className}__content-wrapper`),
			style: {
				backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : customBackgroundColor
			}
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperProps}>
					<div className={`${className}__wrapper`}>
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

							{
								!isCircle && (
									<span className={`${className}__percent`}>{showPercent()}</span>
								)
							}
						</div>

						{
							isCircle && (
								<div className={`${className}__content-wrapper`}>

									<div className={`${className}__circle-background`} style={{
										backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : customBackgroundColor
									}}></div>

									<div className={`${className}__circle-foreground`}></div>
									<canvas className={`${className}__counter`} height="200" width="200" />
								</div>
							)
						}
						{
							!isCircle && (
								<div {...contentWrapperPropds}>
									<div className={`${className}__content`} style={{

										backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
											&& typeof this.props.attributes.textColor.class == 'undefined') ?
											this.props.textColor.color : (customTextColor ? customTextColor : undefined),

										width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
									}}></div>
								</div>
							)
						}
					</div>
				</div>
			</Fragment>
		);
	}

	/* #region  change method after refactoring */
	tempMethod() {
		const {
			attributes: {
				fillAmount,
			},

			clientId,
			className,
			textColor

		} = this.props;

		const counter = $(`.${clientId}`).find(`.${className}__counter`).get(0).getContext('2d');

		let diff = ((parseInt(fillAmount) / 100) * Math.PI * 2 * 10),
			cw = counter.canvas.width,
			ch = counter.canvas.height;

		counter.clearRect(0, 0, cw, ch);
		counter.lineWidth = 6.1;
		counter.fillStyle = '#fff';
		counter.strokeStyle = textColor.color;
		counter.textAlign = 'center';
		counter.font = "25px monospace";
		counter.fillStyle = '#4a4949';
		counter.fillText(parseInt(fillAmount) + '%', 100, 110);
		counter.beginPath();
		counter.arc(100, 100, 92.6, 4.72, diff / 10 + 4.72);
		counter.stroke();
	}
	/* #endregion */

	componentDidUpdate(prevProps) {

		if (prevProps.isSelected === this.props.isSelected) {
			const {
				attributes: {
					isAnimated,
					fillAmount,
					typeBar
				},
				textColor,
				className,
				clientId

			} = this.props;

			if (!isAnimated) {
				this.resetWidth(fillAmount);
			}

			if (prevProps.attributes.typeBar != typeBar) {
				if (this.props.attributes.typeBar === 'default') {
					this.resetWidth();
					this.showDefaultBar();
				} else {
					this.showCircleBar();
				}
			}

			const isCircle = this.checkTypeBar();
			if (isCircle && prevProps.attributes.fillAmount != fillAmount) {
				this.showCircleBar(true);
			}

			if (!isCircle && prevProps.attributes.fillAmount != fillAmount) {
				$(`.${clientId}`).find(`.${className}__content`).css('width', `${fillAmount}%`);
				$(`.${clientId}`).find(`.${className}__percent`).text(`${fillAmount}%`);
			}

			if (textColor.color !== undefined) {
				if (prevProps.textColor.color !== this.props.textColor.color && isCircle) {
					this.tempMethod();
				}
			}
		}
	}

	componentDidMount() {
		const isCircle = this.checkTypeBar();
		if (!isCircle) {
			this.setState({ withoutAnim: true });
			this.showDefaultBar();
		} else {
			this.showCircleBar();
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

	showDefaultBar() {
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

	showCircleBar(changeDirectly = false) {
		const {
			attributes: {
				fillAmount,
				isAnimated
			},
			isInViewport,
			scrollHandler,

			textColor,

			className,
			clientId
		} = this.props;

		const counter = $(`.${clientId}`).find(`.${className}__counter`).get(0).getContext('2d');

		let no = changeDirectly ? parseInt(fillAmount) : isAnimated ? 0 : parseInt(fillAmount),
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
			counter.strokeStyle = textColor.color ? textColor.color : $(`.${className}__counter`).css('color');
			counter.textAlign = 'center';
			counter.font = "25px monospace";
			counter.fillStyle = '#4a4949';
			counter.fillText(no + '%', 100, 110);
			counter.beginPath();
			counter.arc(100, 100, 92.6, pointToFill, diff / 10 + pointToFill);
			counter.stroke();

			if (checkStop) checkStop();
		}

		const animate = (fillCounter) => {
			const {
				attributes: {
					fillAmount,
					isAnimated
				}
			} = this.props;
			fill = setInterval(fillCounter.bind(null, () => {
				if (isAnimated) {
					if (no >= parseInt(fillAmount)) {
						clearTimeout(fill);
					}
					no++;
				}
			}), 35);
		}

		const root = '.edit-post-layout__content';

		if (isAnimated && !changeDirectly) {
			const $bar = $(`.${clientId}`).find(`.${className}__circle-background`);
			if (isInViewport($bar)) {
				animate(fillCounter);
			} else {
				scrollHandler(root, $bar, () => {
					animate(fillCounter);
				});
			}
		} else {
			fillCounter();
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);