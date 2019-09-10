/**
 * External dependencies
 */
import classnames from 'classnames';

const {RichText} = wp.editor;
const {InnerBlocks, getColorClassName} = wp.editor;
const {Component} = wp.element;

/**
 * Create an Component
 */
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {className, baseClass} = this.props;
		const {id, url, meta, cardPosition} = this.props.attributes;

		const {outerParent} = this.props.attributes;
		const customBackgroundColor = outerParent && outerParent.attributes.customBackgroundColor ? outerParent.attributes.customBackgroundColor : undefined;
		const backgroundColor = outerParent && outerParent.attributes.backgroundColor ? outerParent.attributes.backgroundColor : undefined;
		const pointColor = outerParent && outerParent.attributes.pointColor ? outerParent.attributes.pointColor : undefined;

		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const contentWrapperStyle = {
			style: {
				paddingTop: outerParent && outerParent.attributes.paddingTop ? outerParent.attributes.paddingTop : undefined,
				paddingBottom: outerParent && outerParent.attributes.paddingBottom ? outerParent.attributes.paddingBottom : undefined,
				paddingLeft: outerParent && outerParent.attributes.paddingLeft ? outerParent.attributes.paddingLeft : undefined,
				paddingRight: outerParent && outerParent.attributes.paddingRight ? outerParent.attributes.paddingRight : undefined,
			}
		};

		const bgColorStyle = {
			style: {
				backgroundColor: !backgroundColor ? customBackgroundColor : undefined
			}
		};

		const bgColorClass = {
			'has-background': backgroundColor || customBackgroundColor,
			[backgroundClass]: backgroundClass
		};

		const cardClass = {
			className: classnames(
				`${baseClass}__card`,
				{
					...bgColorClass,
				}
			),
			...bgColorStyle
		};

		const itemClass= {
			className: classnames(className, {
				'has-card-left': cardPosition == 'left',
				'has-card-right': cardPosition == 'right'
			})
		};

		const timeLineStyle = {
			style: {
				marginBottom: outerParent && outerParent.attributes.marginBottom ? outerParent.attributes.marginBottom : undefined
			}
		};

		const pointStyle = {
			style: {
				marginLeft: outerParent && outerParent.attributes.horizontalSpace ? outerParent.attributes.horizontalSpace : undefined,
				marginRight: outerParent && outerParent.attributes.horizontalSpace ? outerParent.attributes.horizontalSpace : undefined
			}
		};

		return (
			<div {...itemClass} {...timeLineStyle}>
				<div className={`${baseClass}__wrapper`}>
					<div {...cardClass}>
						<div className={`${baseClass}__card-wrapper`}>
							{url && (<div className={`${baseClass}__image-wrapper`}>
									<img className={`${baseClass}__image ` + (id ? `wp-image-${id}` : null)} src={url}
										 alt={''}/>
								</div>
							)}
							<div className={`${baseClass}__content-wrapper`} {...contentWrapperStyle}>
								<InnerBlocks.Content/>
							</div>
						</div>
					</div>

					<div className={`${baseClass}__point`} {...pointStyle} data-point-color={pointColor}>
						<div className={`${baseClass}__point-content`}></div>
					</div>

					<div className={`${baseClass}__meta`}>
						{meta && (
							<RichText.Content
								tagName={'p'}
								className={`${baseClass}__meta-content`}
								value={meta}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Save;
