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

			baseClass,

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
			className: classnames(`${baseClass}__bar`),
			style: {
				backgroundColor: backgroundColor.color ? backgroundColor.color : customBackgroundColor
			}
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperProps}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__header`}>

							<RichText
								tagName='p'
								className={`${baseClass}__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
							{/* <span className={`${baseClass}__percent`}>{showPercent()}</span> */}
							<span className={`${baseClass}__percent`}>
								{
									`${fillAmount ? fillAmount : '0'}%`
								}
							</span>
						</div>

						<div {...contentWrapperPropds}>
							<div className={`${baseClass}__progress`} style={{

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
				baseClass,
				clientId

			} = this.props;

			const value = fillAmount ? fillAmount : '0';

			if (!$.parseJSON(isAnimated)) {
				const { clientId } = this.props;				
				$(`.${clientId}`).find(`.${baseClass}__progress`).css('width', `${value}%`);
			}

			if (!isEqual(prevProps.attributes, this.props.attributes)) {
				$(`.${clientId}`).find(`.${baseClass}__progress`).css('width', `${value}%`);
				$(`.${clientId}`).find(`.${baseClass}__percent`).text(`${value}%`);
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
			baseClass,

		} = this.props;

		let $progress = $(ReactDOM.findDOMNode(this));
		let $content = $(`.${baseClass}__progress`, $progress);

		const percent = () => { return Math.ceil(($content.width() / $content.parent().width()) * 100); }

		$content.animate({ width: `${fillAmount}%` }, {
			duration: 2000,
			progress: () => {
				let $percent = $(`.${baseClass}__percent`, $progress);
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

			baseClass,
			clientId,

		} = this.props;

		const $id = $(`.${clientId}`);
		const $bar = $id.find(`.${baseClass}__progress`);

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
			$id.find(`.${baseClass}__progress`).css('width', `${fillAmount}%`);
			$id.find(`.${baseClass}__percent`).text(`${fillAmount}%`);
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);