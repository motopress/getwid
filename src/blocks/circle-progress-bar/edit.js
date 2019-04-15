import Inspector from './inspector';
import classnames from 'classnames';
import { isEqual } from "lodash";

const { __ } = wp.i18n;

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.drawCircleBar = this.drawCircleBar.bind(this);
		this.drawFrame = this.drawFrame.bind(this);

		const { attributes: { isAnimated } } = this.props;

		this.state = {
			fillComplete: !$.parseJSON(isAnimated) ? true : false,
			holderWidth: undefined
		}
	}

	render() {
		const {
			attributes: {
				customBackgroundColor,
				title
			},

			clientId,
			className,
			setAttributes,

			backgroundColor,
			textColor

		} = this.props;

		const wrapperProps = {
			className: classnames(className,
				{
					'has-background': backgroundColor.color,
					[backgroundColor.class]: backgroundColor.class,

					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}, 
			clientId),
		}

		const contentWrapperPropds = {
			className: classnames(`${className}__bar-background`),
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
						</div>

						<div className={`${className}__content-wrapper`}>

							<div {...contentWrapperPropds}></div>

							<div className={`${className}__circle-foreground`}></div>
							<canvas className={`${className}__counter`} height="200" width="200" />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}	

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			const { textColor } = this.props;

			if (!isEqual(prevProps.attributes, this.props.attributes)) {
				this.drawFrame(false, true);
			}

			if (textColor.color !== undefined) {
				if (!isEqual(prevProps, this.props)) {
					this.drawFrame(false, true);
				}
			}
		}
	}

	componentDidMount() {
		this.drawCircleBar();
	}	

	drawFrame(setByAnim = false, changeDirectly = false) {
		const {
			attributes: {
				fillAmount,
				isAnimated,

				customTextColor
			},

			clientId,
			className,
			textColor

		} = this.props;

		const counter = $(`.${clientId}`).find(`.${className}__counter`).get(0).getContext('2d');

		let no = changeDirectly ? parseInt(fillAmount) : $.parseJSON(isAnimated) ? 0 : parseInt(fillAmount),
			pointToFill = 4.72,
			cw = counter.canvas.width,
			ch = counter.canvas.height,
			diff;

		const fillCounter = (stop) => {
			diff = ((no / 100) * Math.PI * 2 * 10);
			counter.clearRect(0, 0, cw, ch);
			counter.lineWidth = 6.1;
			counter.fillStyle = '#fff';
			
			counter.strokeStyle = textColor.class ? textColor.color : (customTextColor !== undefined) ? customTextColor : $(`.${className}__counter`).css('color');

			counter.textAlign = 'center';
			counter.font = "25px monospace";
			counter.fillStyle = '#4a4949';
			counter.fillText(no + '%', 100, 110);
			counter.beginPath();
			counter.arc(100, 100, 92.6, pointToFill, diff / 10 + pointToFill);
			counter.stroke();

			if (stop) stop();
		}
		
		if (setByAnim) {
			let fill = setInterval(fillCounter.bind(null, () => {
				if (no >= parseInt(fillAmount)) {
					clearTimeout(fill);
				}
				no++;
			}), 35);
		} else {
			fillCounter();
		}
	}

	drawCircleBar() {
		const {
			attributes: {
				isAnimated
			},

			isInViewport,
			scrollHandler,

			clientId,
			className

		} = this.props;

		const root = '.edit-post-layout__content';

		if ($.parseJSON(isAnimated)) {
			const $bar = $(`.${clientId}`).find(`.${className}__bar-background`);
			if (isInViewport($bar)) {
				this.drawFrame(true);
			} else {
				scrollHandler(root, $bar, () => {
					this.drawFrame(true);
				});
			}
		} else {
			this.drawFrame();
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);