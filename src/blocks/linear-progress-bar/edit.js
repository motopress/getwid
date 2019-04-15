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
	
		this.drawLinearBar = this.drawLinearBar.bind(this);	
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
							<span className={`${className}__percent`}>{showPercent()}</span>						
						</div>

						<div {...contentWrapperPropds}>
							<div className={`${className}__content`} style={{

								backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
									&& typeof this.props.attributes.textColor.class == 'undefined') ?
									this.props.textColor.color : (customTextColor ? customTextColor : undefined),

								width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
							}}></div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}	

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			const {
				attributes: {
					isAnimated,
					fillAmount,
				},
				className,
				clientId

			} = this.props;

			if (!$.parseJSON(isAnimated)) {
				const { clientId, className } = this.props;
				$(`.${clientId}`).find(`.${className}__content`).css('width', `${fillAmount}%`);
			}

			if (!isEqual(prevProps.attributes, this.props.attributes)) {
				$(`.${clientId}`).find(`.${className}__content`).css('width', `${fillAmount}%`);
				$(`.${clientId}`).find(`.${className}__percent`).text(`${fillAmount}%`);
			}
		}
	}

	componentDidMount() {
		this.drawLinearBar();
	}

	drawFrame() {
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

	drawLinearBar() {
		const {
			attributes: {
				isAnimated,
				fillAmount
			},
			isInViewport,
			scrollHandler,

			className,
			clientId,

		} = this.props;

		const $id = $(`.${clientId}`);
		const $bar = $id.find(`.${className}__content`);

		const root = '.edit-post-layout__content';

		if ($.parseJSON(isAnimated)) {
			if (isInViewport($bar)) {
				this.drawFrame($bar);
			} else {
				scrollHandler(root, $bar, () => {
					this.drawFrame($bar);
				});
			}
		} else {
			$id.find(`.${className}__content`).css('width', `${fillAmount}%`);
			$id.find(`.${className}__percent`).text(`${fillAmount}%`);
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);