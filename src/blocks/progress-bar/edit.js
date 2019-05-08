import Inspector from './inspector';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import { __ } from 'wp.i18n';

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.drawAnimatedLines = this.drawAnimatedLines.bind(this);
		this.drawLines 		   = this.drawLines.bind(this);
		this.setSize 		   = this.setSize.bind(this);
		this.draw 			   = this.draw.bind(this);
		this.setPercent 	   = this.setPercent.bind(this);
	}

	render() {
		const {
			attributes: {
				fillAmount,
				title
			},

			clientId,
			className,
			setAttributes,

			baseClass,

		} = this.props;

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={classnames(className, clientId)}>
					<div className={`${baseClass}__wrapper`}>

						<div className={`${baseClass}__header`}>
							<RichText
								tagName='p'
								className={`${baseClass}__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title ? title : ''}
								onChange={title => {
									setAttributes({ title })
								}}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
							<span className={`${baseClass}__percent`}>
								{
									`${fillAmount ? fillAmount : '0'}%`
								}
							</span>
						</div>

						<div className={`${baseClass}__line-wrapper`}>
							<canvas className={`${baseClass}__canvas`}/>
						</div>

					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			const { attributes: { fillAmount } } = this.props;

			if (!isEqual(prevProps, this.props)) {
				this.drawLines(fillAmount ? fillAmount : '0');
			}
		}
	}

	componentDidMount() {
		this.draw();
	}

	componentWillUnmount() {
		clearInterval(this.fill);
	}

	draw() {
		const {
			attributes: {
				isAnimated,
				fillAmount
			},
			clientId,
			baseClass,

			isInViewport,
			scrollHandler

		} = this.props;

		const root = '.edit-post-layout__content';

		$(window).resize(() => { this.drawLines(fillAmount) });

		if ($.parseJSON(isAnimated)) {
			const $bar = $(`.${clientId}`).find(`.${baseClass}__line-wrapper`);
			if (isInViewport($bar)) {
				this.drawAnimatedLines();
			} else {
				scrollHandler(root, $bar, () => {
					this.drawAnimatedLines();
				});
			}
		} else {
			this.drawLines(fillAmount);
		}
	}

	drawAnimatedLines() {
		const { attributes: { fillAmount } } = this.props;
		let value = 0;
		this.fill = setInterval(() => {
			this.drawLines(value);

			value++;
			if (value > fillAmount) {
				clearInterval(this.fill);
			}
		}, 35);
	}

	drawLines(value) {

		const config = this.getConfig();
		const { context, backgroundColor, textColor } = config;

		let width = this.setSize();
		context.clearRect(0, 0, width, 10);

		context.beginPath();

		context.moveTo(0, 10);
		context.lineTo(width, 10);

		context.lineWidth = 10;
		context.strokeStyle = backgroundColor;
		context.stroke();

		context.beginPath();

		context.moveTo(0, 10);
		context.lineTo((width * value) / 100, 10);

		context.lineWidth = 10;
		context.strokeStyle = textColor;
		context.stroke();

		this.setPercent(value);
	}

	getConfig() {
		const {
			clientId,
			baseClass,

			backgroundColor,
			textColor

		} = this.props;

		return {
			context: $(`.${clientId}`).find(`.${baseClass}__canvas`).get(0).getContext('2d'),

			backgroundColor: backgroundColor.color ? backgroundColor.color : '#eeeeee',
			textColor	   : textColor.color 	   ? textColor.color 	   : '#0000ee'
		}
	}

	setSize() {
		const { clientId, baseClass } = this.props;

		const canvas = $(`.${clientId}`).find(`.${baseClass}__canvas`).get(0);
		const width  = $(`.${clientId}`).find(`.${baseClass}__wrapper`).css('width');

		canvas.width = parseFloat(width.replace(/px$/, ''));
		canvas.height = 10;

		return canvas.width;
	}

	setPercent(value) {
		const { clientId, baseClass } = this.props;
		$(`.${clientId}`).find(`.${baseClass}__percent`).html(`${value}%`);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);