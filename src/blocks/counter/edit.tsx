import {
	AlignmentToolbar,
	BlockControls,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import type { CounterEditProps } from './types';
import { getCountUpOptions } from './utils';

import './style.scss';
import './editor.scss';

const baseClass = 'wp-block-getwid-counter';
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function CounterEdit( props: CounterEditProps ) {
	const { attributes, clientId, setAttributes, textColor } = props;
	const { customTextColor, prefix, suffix, wrapperAlign } = attributes;
	const blockRef = useRef< HTMLDivElement >( null );
	const blockProps = useBlockProps( {
		className: clientId,
	} );
	const numberClassName = classnames( `${ baseClass }__number`, {
		'has-text-color': textColor.color || customTextColor,
		[ textColor.class || '' ]: textColor.class,
	} );

	useEffect( () => {
		const block = blockRef.current;
		const CountUp = window.CountUp;

		if ( ! block || typeof CountUp !== 'function' ) {
			return;
		}

		const counter = block.querySelector< HTMLElement >(
			`.${ baseClass }__number`
		);

		if ( ! counter ) {
			return;
		}

		new CountUp(
			counter,
			Number.parseFloat( attributes.end ),
			getCountUpOptions( attributes )
		).start();
	}, [ attributes ] );

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ wrapperAlign }
					onChange={ ( nextWrapperAlign ) =>
						setAttributes( {
							wrapperAlign: nextWrapperAlign,
						} )
					}
				/>
			</BlockControls>

			<Inspector { ...props } />

			<div { ...blockProps }>
				<div
					ref={ blockRef }
					className={ `${ baseClass }__wrapper` }
					style={ { textAlign: wrapperAlign || undefined } }
				>
					<RichText
						tagName="p"
						className={ `${ baseClass }__prefix` }
						placeholder={ __( 'Prefix', 'getwid' ) }
						value={ prefix || '' }
						onChange={ ( nextPrefix ) =>
							setAttributes( { prefix: nextPrefix } )
						}
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
					<span
						className={ numberClassName }
						style={ {
							color:
								textColor.color || customTextColor || undefined,
						} }
					>
						0
					</span>
					<RichText
						tagName="p"
						className={ `${ baseClass }__suffix` }
						placeholder={ __( 'Suffix', 'getwid' ) }
						value={ suffix || '' }
						onChange={ ( nextSuffix ) =>
							setAttributes( { suffix: nextSuffix } )
						}
						multiline={ false }
						allowedFormats={ allowedFormats }
					/>
				</div>
			</div>
		</>
	);
}

export default withColors( { textColor: 'color' } )( CounterEdit );
