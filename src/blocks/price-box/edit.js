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

		const textStyle = {
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

		console.log(currency);

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperPricingTableProps}>
					<RichText
						tagName="span"
						className={`${className}__title`}
						placeholder={__('Plan A', 'getwid')}
						value={ title ? title : '' }
						onChange={ title => setAttributes({ title }) }
						keepPlaceholderOnFocus={ true }
						style={ textStyle }
						multiline={ false }
					/>

					<div className={`${className}__price-wrapper`}>
						<RichText
							tagName="span"
							className={`${className}__currency`}
							placeholder={__('$', 'getwid')}
							value={ currency ? currency : '' }
							onChange={ currency => setAttributes({ currency }) }
							keepPlaceholderOnFocus={ true }
							style={ textStyle }
							multiline={ false }
						/>

						<RichText
							tagName="span"
							className={`${className}__amount`}
							placeholder={__('99', 'getwid')}
							value={ amount ? amount : '' }
							onChange={ amount => setAttributes({ amount }) }
							keepPlaceholderOnFocus={ true }
							style={ textStyle }
							multiline={ false }
						/>
					</div>

					<RichText
						tagName="ul"
						className={`${className}__features`}
						placeholder={__('Add features', 'getwid')}
						value={ features ? features : '' }
						onChange={ features => setAttributes({ features }) }
						keepPlaceholderOnFocus={ true }
						style={ textStyle }
						multiline={ 'li' }
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