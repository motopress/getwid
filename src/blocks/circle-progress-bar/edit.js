import Inspector from './inspector';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import { __ } from 'wp.i18n';

const {
	withColors,
	BlockControls,
	AlignmentToolbar

} = wp.editor;

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.draw = this.draw.bind(this);
		this.getThickness = this.getThickness.bind(this);
		this.drawAnimatedArcs = this.drawAnimatedArcs.bind(this);
		this.drawArcs = this.drawArcs.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.setSize = this.setSize.bind(this);
		this.setCanvasAlign = this.setCanvasAlign.bind(this);
	}

	render() {
		const {
			attributes: {
				canvasAlign
			},

			setAttributes,
			clientId,
			className,
			baseClass

		} = this.props;

		return (
			[
				<BlockControls>
					<AlignmentToolbar
						value={canvasAlign}
						onChange={(canvasAlign) => {
							this.setCanvasAlign(canvasAlign);
							setAttributes({ canvasAlign });
						}}
					/>
				</BlockControls>,
				<Inspector {...this.props} />,
				<Fragment>
					<div className={classnames(className, clientId)}>
						<div className={`${baseClass}__wrapper`}>
							<canvas className={`${baseClass}__canvas`} />
						</div>
					</div>
				</Fragment>
			]
		);
	}

	getConfig() {
		const { attributes: { size } } = this.props;
		const { baseClass, backgroundColor, textColor } = this.props;

		return {
			context: $(`.${baseClass}__canvas`).get(0).getContext('2d'),

			backgroundColor: backgroundColor.color ? backgroundColor.color : '#e8edf0',
			textColor: textColor.color ? textColor.color : '#5cb0d8',

			radius: parseFloat(size) / 2,
			angle: -90 * (Math.PI / 180)
		}
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
			scrollHandler,

		} = this.props;

		const root = '.edit-post-layout__content';

		if ($.parseJSON(isAnimated)) {
			const $bar = $(`.${clientId}`).find(`.${baseClass}__wrapper`);
			if (isInViewport($bar)) {
				this.drawAnimatedArcs();
			} else {
				scrollHandler(root, $bar, () => {
					this.drawAnimatedArcs();
				});
			}
		} else {
			this.drawArcs(fillAmount);
		}
	}

	drawArcs(value) {
		const { attributes: { size } } = this.props;

		const config = this.getConfig();

		let context = config.context,
			radius = config.radius,
			angle = config.angle,

			backgroundColor = config.backgroundColor,
			textColor = config.textColor,
			thickness = parseInt(this.getThickness());

		this.setSize();
		context.clearRect(0, 0, parseFloat(size), parseFloat(size));

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
		const { attributes: { fillAmount } } = this.props;
		let value = 0;
		let fill = setInterval(() => {
			this.drawArcs(value);

			value++;
			if (value > fillAmount) {
				clearInterval(fill);
			}
		}, 35);
	}

	getThickness() {
		const {
			attributes: {
				thickness,
				size
			}
		} = this.props;

		return (($.isNumeric(thickness) ? thickness : size / 14) * (size / 2)) / 100;
	}

	setCanvasAlign(align) {
		const { clientId, baseClass } = this.props;
		$(`.${clientId}`).find(`.${baseClass}__wrapper`).css('text-align', `${align}`);
	}

	setSize() {
		const { attributes: { size }, baseClass } = this.props;
		const canvas = $(`.${baseClass}__canvas`).get(0);

		canvas.width = parseFloat(size);
		canvas.height = parseFloat(size);
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			const { attributes: { fillAmount } } = this.props;

			if (!isEqual(prevProps, this.props)) {
				this.drawArcs(fillAmount);
			}
		}
	}

	componentDidMount() {
		this.draw();
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);