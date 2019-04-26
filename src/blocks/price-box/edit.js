import Inspector from './inspector';
import classnames from 'classnames';

import { __, _x } from 'wp.i18n';
import './editor.scss';

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
				period,
				features,

				headerTag,

				customBackgroundColor,
				customTextColor,
			},

			className,
			baseClass,
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

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperPricingTableProps}>

					<RichText
						tagName={ headerTag }
						className={`${baseClass}__title`}
						placeholder={__('Write heading…', 'getwid')}
						value={title ? title : ''}
						onChange={title => setAttributes({ title })}
						keepPlaceholderOnFocus={true}
						style={textStyle}
						multiline={false}
					/>

					<div className={`${baseClass}__pricing`}>
						<RichText
							tagName='p'
							className={`${baseClass}__currency`}
							placeholder={_x('$', 'Price Box placeholder', 'getwid')}
							value={ currency ? currency : '' }
							onChange={ currency => { setAttributes({ currency })} }
							keepPlaceholderOnFocus={ true }
							style={ textStyle }
							multiline={ false }
						/>

						<RichText
							tagName='p'
							className={`${baseClass}__amount`}
							placeholder={_x('99', 'Price Box placeholder', 'getwid')}
							value={ amount ? amount : '' }
							onChange={ amount => setAttributes({ amount }) }
							keepPlaceholderOnFocus={ true }
							style={ textStyle }
							multiline={ false }
						/>

						<RichText
							tagName='p'
							className={`${baseClass}__period`}
							placeholder={_x('/month', 'Price Box placeholder', 'getwid')}
							value={period ? period : ''}
							onChange={ period => setAttributes({ period })}
							keepPlaceholderOnFocus={true}
							style={textStyle}
							multiline={false}
						/>
					</div>

					<RichText
						tagName='ul'
						className={`${baseClass}__features`}
						placeholder={__('Write text…', 'getwid')}
						value={ features ? features : '' }
						onChange={ features => setAttributes({ features }) }
						keepPlaceholderOnFocus={ true }
						style={ textStyle }
						multiline={ 'li' }
					/>

					<InnerBlocks
						template={[
							['core/button']
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