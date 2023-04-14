/**
* External dependencies
*/
import { __, _x } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText, InnerBlocks, withColors } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { title, currency, amount, period, features } = this.props.attributes;
		const { headerTag, customTextColor, customBackgroundColor } = this.props.attributes;
		const { className, baseClass, setAttributes, backgroundColor, textColor } = this.props;



		const textStyle = {
			color: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),
		}

		const wrapperPriceBoxProps = {
			className: classnames(`${className}`,
				{
					'has-background': backgroundColor.color,
					[ backgroundColor.class ]: backgroundColor.class,

					'has-text-color': textColor.color,
					[ textColor.class ]: textColor.class,
				}),
			style: { backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color :
				(customBackgroundColor ? customBackgroundColor : undefined)
			}
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div {...wrapperPriceBoxProps}>

					<RichText
						tagName={ headerTag }
						className={ `${baseClass}__title` }
						placeholder={ __( 'Write heading…', 'getwid' ) }
						value={title ? title : ''}
						onChange={ title => setAttributes( { title } ) }
						style={ textStyle }
						multiline={ false }
						allowedFormats={allowedFormats}
					/>

					<div className={`${baseClass}__pricing`}>
						<RichText
							tagName={ 'p' }
							className={ `${baseClass}__currency` }
							placeholder='$'
							value={ currency ? currency : '' }
							onChange={ currency => { setAttributes( { currency } ) } }
							style={ textStyle }
							multiline={ false }
							allowedFormats={allowedFormats}
						/>

						<RichText
							tagName={ 'p' }
							className={ `${baseClass}__amount` }
							placeholder='99'
							value={ amount ? amount : '' }
							onChange={ amount => setAttributes( { amount } ) }
							style={ textStyle }
							multiline={ false }
							allowedFormats={allowedFormats}
						/>

						<RichText
							tagName={ 'p' }
							className={ `${baseClass}__period` }
							placeholder={ _x( '/month', 'Period, placeholder', 'getwid' ) }
							value={ period ? period : ''}
							onChange={ period => setAttributes( { period } ) }
							style={ textStyle}
							multiline={ false }
							allowedFormats={allowedFormats}
						/>
					</div>

					<RichText
						tagName={ 'ul' }
						className={ `${baseClass}__features` }
						placeholder={ __( 'Write text…', 'getwid' ) }
						value={ features ? features : '' }
						onChange={ features => setAttributes( { features } ) }
						style={ textStyle }
						multiline={ 'li' }
						allowedFormats={allowedFormats}
					/>

					<InnerBlocks
						template={[
							[ 'core/button' ]
						]}
						allowedBlocks={ [ 'core/button' ] }
						templateInsertUpdatesSelection={ false }
						templateLock={ 'all' }
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);