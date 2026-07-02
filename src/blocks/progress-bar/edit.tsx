import { RichText, useBlockProps, withColors } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import type { ComponentType } from '@wordpress/element';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { allowedFormats, baseClass } from './constants';
import Inspector from './inspector';
import type { ProgressBarEditProps } from './types';

import './editor.scss';
import './style.scss';

function ProgressBarEdit( props: ProgressBarEditProps ) {
	const { attributes, setAttributes, className, backgroundColor, textColor } =
		props;
	const {
		title,
		fillAmount,
		isAnimated,
		customTextColor,
		customBackgroundColor,
	} = attributes;
	const blockRef = useRef< HTMLDivElement >( null );
	const progressRef = useRef< HTMLDivElement >( null );
	const percentRef = useRef< HTMLSpanElement >( null );
	const blockProps = useBlockProps( {
		className,
	} );
	const contentWrapperProps = {
		className: `${ baseClass }__bar`,
		style: {
			backgroundColor: backgroundColor.color
				? backgroundColor.color
				: customBackgroundColor,
		},
	};
	const progressStyle = {
		backgroundColor:
			attributes.textColor !== undefined && textColor.class === undefined
				? textColor.color
				: customTextColor || undefined,
	};

	useEffect( () => {
		const progress = progressRef.current;
		const percent = percentRef.current;
		const fillValue = Number.parseInt( fillAmount || '0', 10 );

		if ( ! progress || ! percent ) {
			return undefined;
		}

		if ( isAnimated !== 'true' ) {
			progress.style.width = `${ fillValue }%`;
			percent.textContent = `${ fillValue }%`;

			return undefined;
		}

		let animationFrame = 0;
		const startedAt = window.performance.now();
		const duration = 2000;

		progress.style.width = '0%';
		percent.textContent = '0%';

		function animate( timestamp: number ) {
			const elapsed = timestamp - startedAt;
			const progressPercent = Math.min( elapsed / duration, 1 );
			const currentValue = Math.round( fillValue * progressPercent );

			if ( progress && percent ) {
				progress.style.width = `${ fillValue * progressPercent }%`;
				percent.textContent = `${ currentValue }%`;
			}

			if ( progressPercent < 1 ) {
				animationFrame = window.requestAnimationFrame( animate );
			}
		}

		animationFrame = window.requestAnimationFrame( animate );

		return () => window.cancelAnimationFrame( animationFrame );
	}, [ fillAmount, isAnimated ] );

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps } ref={ blockRef }>
				<div className={ `${ baseClass }__wrapper` }>
					<div className={ `${ baseClass }__header` }>
						<RichText
							tagName="p"
							className={ `${ baseClass }__title` }
							placeholder={ __( 'Write heading…', 'getwid' ) }
							value={ title || '' }
							onChange={ ( nextTitle ) =>
								setAttributes( { title: nextTitle } )
							}
							multiline={ false }
							allowedFormats={ allowedFormats }
						/>
						<span
							ref={ percentRef }
							className={ `${ baseClass }__percent` }
						>
							{ `${ fillAmount || '0' }%` }
						</span>
					</div>

					<div { ...contentWrapperProps }>
						<div
							ref={ progressRef }
							className={ clsx( `${ baseClass }__progress`, {
								'has-text-color':
									textColor.color || customTextColor,
								[ textColor.class ?? '' ]: textColor.class,
							} ) }
							style={ progressStyle }
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( ProgressBarEdit ) as ComponentType<
	Omit<
		ProgressBarEditProps,
		'backgroundColor' | 'textColor' | 'setBackgroundColor' | 'setTextColor'
	>
>;
