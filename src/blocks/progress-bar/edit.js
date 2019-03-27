import Inspector from './inspector';
import classnames from 'classnames';

import "jquery-visible";

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const { compose } = wp.compose;

const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.animate = this.animate.bind(this);
		this.ScrollHandler = this.ScrollHandler.bind(this);

		this.state = {
			fillComplete: false,
			isInVisible: false,
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
					//'data-wow-offset': 10,
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

	ScrollHandler(root, node) {
		$(root).scroll({ node: node }, (event) => {
			console.log("Scrolling!!!");
			if (WOW.prototype.isVisible(event.data.node)) {

				//console.log($node.get(event.data.node));

				this.setState({ isVisible: true });
				this.animate();
				$(root).off(event);
			}
		});
	}

	componentDidMount() {
		const { className, clientId } = this.props;

		const $base = $(`.${clientId}`);
		const $bar = $($base, `.${className}__content`);

		const root = '.edit-post-layout__content';

		const { isInVisible } = this.state;

		/* #region Origin   */
		// if (!isInVisible) {
		// 	if ($bar.visible()) {
		// 		this.setState({ isVisible: true });
		// 		this.animate($bar);
		// 	} else {
		// 		this.ScrollHandler(root, $bar);
		// 	}
		// }
		/* #endregion */

		/* #region  Check visible by WoW */
		const $node = $base.find(`.${className}__content`);
		//console.log('clientId: ' + $base.attr('class').split(' ')[1]);
		console.log('className: ' + $node.attr('class'));
		
		const config = {	
			boxClass: $node.attr('class'), //`${className}__content`,
			animateClass: 'animated',
			offset: 0,
			scrollContainer: null //'.edit-post-layout__content',
		}

		WOW.prototype.config = config;
		WOW.prototype.element = $('.edit-post-layout__content')[0];   //window.document.documentElement;

		//console.log($bar.attr('class').split(' '));
		//console.log($base.find(`.${className}__content`).attr('class'));
		//const boxes = [].slice.call(WOW.prototype.element.querySelectorAll(`.${$base.find(`.${className}__content`).attr('class')}`));
		//const boxes = [].slice.call(WOW.prototype.element.querySelectorAll('.' + $base.find(`.${className}__content`).attr('class')));
		

		if (!isInVisible) {
			if (WOW.prototype.isVisible($node.get(0))) {

				console.log($node.get(0));

				this.setState({ isVisible: true });
				this.animate($bar);
			} else {
				console.log("set scroll handler");
				console.log($node.get(0));
				this.ScrollHandler(root, $node.get(0));
			}
		}
		/* #endregion */
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);