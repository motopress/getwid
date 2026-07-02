import {
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import type { ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { allowedFormats, baseClass } from './constants';
import Inspector from './inspector';
import type { MediaObject, PriceListEditProps } from './types';
import { getThumbnailUrl } from './utils';

import './editor.scss';
import './style.scss';

const allowedMediaTypes = [ 'image' ];

function PriceListEdit( props: PriceListEditProps ) {
	const { attributes, setAttributes, className, textColor } = props;
	const {
		title,
		amount,
		currency,
		description,
		url,
		id,
		titleTag,
		customTextColor,
		dotted,
		currencyPosition,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-dots': dotted,
		} ),
	} );
	const wrapperPriceProps = {
		className: clsx( `${ baseClass }__price-wrapper`, {
			'has-currency-after': currencyPosition === 'currency-after',
			'has-currency-after-space':
				currencyPosition === 'currency-after-space',
			'has-currency-before-space':
				currencyPosition === 'currency-before-space',
		} ),
	};
	const wrapperProps = {
		className: clsx( `${ baseClass }__content-wrapper`, {
			'has-text-color': textColor.color,
			[ textColor.class ?? '' ]: textColor.class,
		} ),
		style: {
			color: textColor.color ? textColor.color : customTextColor,
		},
	};

	function onSelectMedia( image: MediaObject ) {
		setAttributes( {
			id: image.id,
			url: getThumbnailUrl( image ),
		} );
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ allowedMediaTypes }
							value={ id }
							render={ ( { open } ) => (
								<ToolbarButton
									label={ __( 'Select Image', 'getwid' ) }
									icon="format-image"
									onClick={ open }
								/>
							) }
						/>
					</MediaUploadCheck>
					{ url && (
						<ToolbarButton
							label={ __( 'Delete Image', 'getwid' ) }
							icon="trash"
							onClick={ () => {
								setAttributes( {
									id: undefined,
									url: undefined,
								} );
							} }
						/>
					) }
				</ToolbarGroup>
			</BlockControls>
			<Inspector { ...props } />
			<div { ...blockProps }>
				{ url && (
					<div className={ `${ baseClass }__image-wrapper` }>
						<img
							src={ url }
							alt=""
							className={ `${ baseClass }__image` }
						/>
					</div>
				) }

				<div { ...wrapperProps }>
					<div className={ `${ baseClass }__header` }>
						<RichText
							tagName={ titleTag }
							className={ `${ baseClass }__title` }
							placeholder={ __( 'Write heading…', 'getwid' ) }
							value={ title || '' }
							onChange={ ( nextTitle ) =>
								setAttributes( { title: nextTitle } )
							}
							multiline={ false }
							allowedFormats={ allowedFormats }
						/>

						<div className={ `${ baseClass }__price-line` } />

						<div { ...wrapperPriceProps }>
							<RichText
								tagName={ titleTag }
								className={ `${ baseClass }__currency` }
								placeholder="$"
								value={ currency || '' }
								onChange={ ( nextCurrency ) =>
									setAttributes( {
										currency: nextCurrency,
									} )
								}
								multiline={ false }
								allowedFormats={ allowedFormats }
							/>

							<RichText
								tagName={ titleTag }
								className={ `${ baseClass }__amount` }
								placeholder="19.99"
								value={ amount || '' }
								onChange={ ( nextAmount ) =>
									setAttributes( { amount: nextAmount } )
								}
								multiline={ false }
								allowedFormats={ allowedFormats }
							/>
						</div>
					</div>

					<RichText
						tagName="p"
						className={ `${ baseClass }__description` }
						placeholder={ __( 'Write text…', 'getwid' ) }
						value={ description || '' }
						onChange={ ( nextDescription ) =>
							setAttributes( {
								description: nextDescription,
							} )
						}
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
				</div>
			</div>
		</>
	);
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( PriceListEdit ) as ComponentType<
	Omit< PriceListEditProps, 'textColor' | 'setTextColor' >
>;
