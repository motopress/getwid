import Inspector from './inspector';
import classnames from 'classnames';

import 'waypoints/lib/noframework.waypoints.js';

const { __ } = wp.i18n;

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.animate 	   = this.animate.bind(this);
		this.isInViewport  = this.isInViewport.bind(this);
		this.scrollHandler = this.scrollHandler.bind(this);

		this.state = {
			fillComplete: false,
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
				title,
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
					[`${className}__content-holder--default-color`]: !this.props.backgroundColor.color,
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
					[clientId]: true,
				}),
			style: {
				backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),

				width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
			}
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={classnames(className)}>
					<div className={`${className}__wrapper ${clientId}`}>
						<div className='wp-block-getwid-progress-bar__title-holder'>

							<RichText
								tagName="h5"
								className={`${className}__title`}
								placeholder={__('Enter title here...', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>

							<span className='wp-block-getwid-progress-bar__percent'>{showPercent()}</span>
						</div>
						<div {...wrapperHolderProps}>
							<div {...wrapperContentProps}></div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	// isInViewport($bar) {
	// 	let itemTop = $bar.offset().top;
	// 	let viewportTop = $(window).scrollTop();
	// 	let windowHeight = $(window).height();

	// 	return (itemTop - viewportTop) - windowHeight < 0;
	// }

	// scrollHandler(rootSelector, $bar) {
	// 	$(rootSelector).on('scroll', { bar: $bar }, (event) => {
	// 		if (this.isInViewport(event.data.bar)) {
	// 			this.setState({ isVisible: true });
	// 			this.animate($bar);	
	// 			$(rootSelector).off('scroll');
	// 		}
	// 	});
	// }

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

	componentDidMount() {
		const { isVisible } = this.state;
		const {
			attributes: {
				isAnimated,
				fillAmount
			},
			className,
			clientId
		} = this.props;

		const $id = $(`.${clientId}`);
		const $bar = $id.find(`.${className}__content`);

		const rootSelector = '.edit-post-layout__content';

		if (!isVisible) {
			if (isAnimated) {
				if (this.isInViewport($bar)) {
					this.setState({ isVisible: true });
					this.animate($bar);
				} else {
					this.scrollHandler(rootSelector, $bar);
				}
			} else {
				this.setState({ isVisible: true });
				$id.find(`.${className}__content`).css('width', `${fillAmount}%`);
				$id.find(`.${className}__percent`).text(`${fillAmount}%`);
			}
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);