import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';

import { drawArcs } from './canvas';
import Inspector from './inspector';
import type { CircleProgressBarEditProps } from './types';

const baseClass = 'wp-block-getwid-circle-progress-bar';

import './style.scss';

export default function Edit( props: CircleProgressBarEditProps ) {
	const { attributes, setAttributes } = props;
	const { wrapperAlign } = attributes;
	const canvasRef = useRef< HTMLCanvasElement >( null );
	const blockProps = useBlockProps();

	useEffect( () => {
		const canvas = canvasRef.current;

		if ( ! canvas ) {
			return undefined;
		}

		if ( attributes.isAnimated === 'true' ) {
			let progress = 0;
			const fillAmount = Number.parseInt( attributes.fillAmount, 10 );
			const intervalId = window.setInterval( () => {
				drawArcs( canvas, attributes, progress );

				progress++;
				if ( progress > fillAmount ) {
					window.clearInterval( intervalId );
				}
			}, 35 );

			return () => window.clearInterval( intervalId );
		}

		drawArcs(
			canvas,
			attributes,
			Number.parseInt( attributes.fillAmount, 10 )
		);

		return undefined;
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
					className={ `${ baseClass }__wrapper` }
					style={ {
						textAlign: wrapperAlign || undefined,
					} }
				>
					<canvas
						ref={ canvasRef }
						className={ `${ baseClass }__canvas` }
					/>
				</div>
			</div>
		</>
	);
}
