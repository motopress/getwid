import {
	InnerBlocks,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { _x, __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { allowedFormats, baseClass } from './constants';
import Inspector from './inspector';
import type { PriceBoxEditProps } from './types';

import './editor.scss';
import './style.scss';

const template = [ [ 'core/button' ] ];
const allowedBlocks = [ 'core/button' ];

function Edit( props: PriceBoxEditProps ) {
	const { attributes, setAttributes, backgroundColor, textColor } = props;
	const {
		title,
		currency,
		amount,
		period,
		features,
		headerTag,
		customTextColor,
		customBackgroundColor,
	} = attributes;
	const textStyle = {
		color:
			typeof attributes.textColor !== 'undefined' &&
			typeof textColor.class === 'undefined'
				? textColor.color
				: customTextColor || undefined,
	};
	const blockProps = useBlockProps( {
		className: clsx( {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ?? '' ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ?? '' ]: textColor.class,
		} ),
		style: {
			backgroundColor: backgroundColor.color
				? backgroundColor.color
				: customBackgroundColor || undefined,
		},
	} );

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<RichText
					tagName={ headerTag }
					className={ `${ baseClass }__title` }
					placeholder={ __( 'Write heading…', 'getwid' ) }
					value={ title || '' }
					onChange={ ( nextTitle ) =>
						setAttributes( { title: nextTitle } )
					}
					style={ textStyle }
					multiline={ false }
					allowedFormats={ allowedFormats }
				/>
				<div className={ `${ baseClass }__pricing` }>
					<RichText
						tagName="p"
						className={ `${ baseClass }__currency` }
						placeholder="$"
						value={ currency || '' }
						onChange={ ( nextCurrency ) =>
							setAttributes( { currency: nextCurrency } )
						}
						style={ textStyle }
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
					<RichText
						tagName="p"
						className={ `${ baseClass }__amount` }
						placeholder="99"
						value={ amount || '' }
						onChange={ ( nextAmount ) =>
							setAttributes( { amount: nextAmount } )
						}
						style={ textStyle }
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
					<RichText
						tagName="p"
						className={ `${ baseClass }__period` }
						placeholder={ _x(
							'/month',
							'Period, placeholder',
							'getwid'
						) }
						value={ period || '' }
						onChange={ ( nextPeriod ) =>
							setAttributes( { period: nextPeriod } )
						}
						style={ textStyle }
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
				</div>
				<RichText
					tagName="ul"
					className={ `${ baseClass }__features` }
					placeholder={ __( 'Write text…', 'getwid' ) }
					value={ features || '' }
					onChange={ ( nextFeatures ) =>
						setAttributes( { features: nextFeatures } )
					}
					style={ textStyle }
					multiline="li"
					allowedFormats={ allowedFormats }
				/>
				<InnerBlocks
					template={ template }
					allowedBlocks={ allowedBlocks }
					templateInsertUpdatesSelection={ false }
					templateLock="all"
				/>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
