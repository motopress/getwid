/**
* Internal dependencies
*/
import Inspector from './inspector';

/**
* External dependencies
*/
import classnames from 'classnames';
import { __, _x } from 'wp.i18n';
import { get } from 'lodash';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { Toolbar, IconButton } = wp.components;
const { RichText, withColors, MediaUploadCheck, MediaUpload, BlockControls } = wp.blockEditor;

/**
* Create an Component
*/
class Edit extends Component {
	
	constructor() {
		super(...arguments);
	}

	render() {

		const { className, baseClass, textColor, setAttributes } = this.props;
		const { title, amount, currency, description, url, id, titleTag, customTextColor, dotted, currencyPosition } = this.props.attributes;

		const textStyle = {
			color: textColor.color !== undefined ? textColor.color : customTextColor ? customTextColor : undefined
		}

		const controls = (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ image => {
									setAttributes( {
										id : get( image, 'id' ),
										url : ! Object.keys( get( image, [ 'sizes' ] ) ).includes( 'thumbnail' ) ? get( image, [ 'sizes', 'full', 'url' ] ) : get( image, [ 'sizes', 'thumbnail', 'url' ] )
									} );
								} }
								allowedTypes={ [ 'image' ] }
								value={ id }
								render={ ( { open } ) => (
									<div>
										<IconButton
											className={ 'components-toolbar__control' }
											label={ __( 'Select Image', 'getwid' ) }
											icon={ 'format-image' }
											onClick={ open }
										/>
									</div>
								)}
							/>
						</MediaUploadCheck>
						{ url && ( <div>
								<IconButton
									className={ 'components-toolbar__control' }
									label={ __( 'Delete Image', 'getwid' ) }
									icon={ 'trash' }
									onClick={ () => {
										setAttributes( { id: undefined, url: undefined } );
									} }
								/>
							</div>
						) }
					</Toolbar>
				</BlockControls>
			</Fragment>
		);

		const wrapperPriceListProps = {
			className: classnames( `${className}`, { 'has-dots': dotted } )
		};

		const wrapperPriceProps = {
			className: classnames( `${baseClass}__price-wrapper`, {
					'has-currency-after': currencyPosition == 'currency-after',
					
					'has-currency-after-space' : currencyPosition == 'currency-after-space',
					'has-currency-before-space': currencyPosition == 'currency-before-space'
				}
			)
		};

		return (
			<Fragment>
				{ controls }
				<Inspector {...this.props}/>
				<div { ...wrapperPriceListProps }> {
						url && ( <div className={ `${baseClass}__image-wrapper` }> {
							<img src={ url } alt={ '' } className={ `${baseClass}__image` }/>
						}
						</div> )
					}

					<div className={ `${baseClass}__content-wrapper` }>
						<div className={ `${baseClass}__header` }>

							<RichText
								tagName={ titleTag }
								className={ `${baseClass}__title` }
								placeholder={ __( 'Write heading…', 'getwid' ) }
								value={ title ? title : '' }

								onChange={ title => {
									setAttributes( { title } );
								} }

								keepPlaceholderOnFocus={ true }
								style={ textStyle }
								multiline={ false }
							/>

							<div className={ `${baseClass}__price-line` } style={ textStyle }></div>

							<div {...wrapperPriceProps}>
								<RichText
									tagName={ titleTag }
									className={ `${baseClass}__currency` }
									placeholder='$'
									value={ currency ? currency : '' }

									onChange={ currency => {
										setAttributes( { currency } );
									} }

									keepPlaceholderOnFocus={ true }
									style={ textStyle }
									multiline={ false }
								/>

								<RichText
									tagName={ titleTag }
									className={ `${baseClass}__amount` }
									placeholder='19.99'
									value={ amount ? amount : '' }

									onChange={ amount => {
										setAttributes( { amount } );
									} }

									keepPlaceholderOnFocus={ true }
									style={ textStyle }
									multiline={ false }
								/>
							</div>							
							
						</div>

						<RichText
							tagName={ 'p' }
							className={ `${baseClass}__description` }
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ description ? description : '' }

							onChange={ description => {
								setAttributes( { description } );
							} }

							keepPlaceholderOnFocus={ true }
							style={ textStyle }
							multiline={ false }
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( Edit );