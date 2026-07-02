import type { CircleProgressBarAttributes } from './types';

const DEFAULT_BACKGROUND_COLOR = '#eeeeee';
const DEFAULT_TEXT_COLOR = '#0000ee';

export function getThickness( attributes: CircleProgressBarAttributes ) {
	const thickness = Number.parseInt( attributes.thickness, 10 );
	const size = Number.parseInt( attributes.size, 10 );

	return thickness || Number.parseInt( String( size / 14 ), 10 );
}

export function drawArcs(
	canvas: HTMLCanvasElement,
	attributes: CircleProgressBarAttributes,
	progress: number
) {
	const { backgroundColor, textColor, size, value } = attributes;
	const context = canvas.getContext( '2d' );

	if ( ! context ) {
		return;
	}

	const parsedSize = Number.parseFloat( size );
	const radius = parsedSize / 2;
	const angle = -90 * ( Math.PI / 180 );
	const thickness = getThickness( attributes );

	canvas.width = parsedSize;
	canvas.height = parsedSize;

	context.clearRect( 0, 0, parsedSize, parsedSize );

	context.beginPath();
	context.arc(
		radius,
		radius,
		radius - thickness / 2,
		angle,
		angle + Math.PI * 2
	);
	context.lineWidth = thickness;
	context.strokeStyle = backgroundColor || DEFAULT_BACKGROUND_COLOR;
	context.stroke();

	context.beginPath();
	context.arc(
		radius,
		radius,
		radius - thickness / 2,
		angle,
		angle + Math.PI * 2 * ( progress / 100 )
	);
	context.lineWidth = thickness;
	context.strokeStyle = textColor || DEFAULT_TEXT_COLOR;
	context.stroke();

	context.beginPath();
	context.textAlign = 'center';
	context.font = '16px serif';
	context.fillText( value || progress + '%', radius + 6.5, radius + 5 );
	context.stroke();
}
