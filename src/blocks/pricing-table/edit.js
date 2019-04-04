import Inspector from './inspector';
import classnames from 'classnames';

import './editor.scss'

const { __ } = wp.i18n;

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;

const {
	RichText,
	InnerBlocks,
	withColors

} = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);		
	}

	render() {
		const {
			attributes: {
				title,
				currency,
				amount,
				features,

				customBackgroundColor,
				customTextColor,
			},

			className,
			setAttributes,

			backgroundColor,
			textColor

		} = this.props;

		const richTextStyle = {
			color: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),
		}

		const wrapperPricingTableProps = {
			className: classnames(`${className}`,
				{
					'has-background': backgroundColor.color,
					[backgroundColor.class]: backgroundColor.class,

					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}),
			style: { backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : customBackgroundColor }
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperPricingTableProps}>
					<RichText
						tagName="h5"
						className={`${className}__title`}
						placeholder={__('Enter title here...', 'getwid')}
						value={title ? title : ''}
						onChange={title => setAttributes({ title })}
						keepPlaceholderOnFocus={true}
						style={richTextStyle}
					/>

					<div className={`${className}__price-wrapper`}>
						<RichText
							tagName="h5"
							className={`${className}__currency`}
							placeholder={__('Enter title here...', 'getwid')}
							value={currency ? currency : ''}
							onChange={currency => setAttributes({ currency })}
							keepPlaceholderOnFocus={true}
							style={richTextStyle}
							multiline={false}
						/>

						<RichText
							tagName="h5"
							className={`${className}__amount`}
							placeholder={__('Enter title here...', 'getwid')}
							value={amount ? amount : ''}
							onChange={amount => setAttributes({ amount })}
							keepPlaceholderOnFocus={true}
							style={richTextStyle}
							multiline={false}
						/>
					</div>

					<RichText
						tagName="h5"
						className={`${className}__features`}
						placeholder={__('Enter title here...', 'getwid')}
						value={features ? features : ''}
						onChange={features => setAttributes({ features })}
						keepPlaceholderOnFocus={true}
						style={richTextStyle}
						multiline={false}
					/>

					<InnerBlocks
						template={[
							['core/button', { text: __('Buy Now', 'getwid') }]
						]}
						allowedBlocks={['core/button']}
						templateInsertUpdatesSelection={false}
						templateLock={'all'}
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);