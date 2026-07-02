import jQuery from 'jquery';

type WaypointOptions = {
	element: HTMLElement;
	handler: () => void;
	offset: string;
};

type WaypointInstance = {
	destroy: () => void;
};

type WaypointConstructor = new ( options: WaypointOptions ) => WaypointInstance;

declare global {
	interface Window {
		Waypoint: WaypointConstructor;
	}
}

const baseClass = '.wp-block-getwid-circle-progress-bar';

function drawArcs(
	canvas: HTMLCanvasElement,
	progress: number,
	value: string | number | undefined,
	config: {
		backgroundColor: string;
		textColor: string;
		size: number;
		thickness: number | string;
	}
) {
	const context = canvas.getContext( '2d' );

	if ( ! context ) {
		return;
	}

	const thickness =
		config.thickness === 'auto'
			? config.size / 14
			: Number( config.thickness );
	const radius = config.size / 2;
	const angle = -90 * ( Math.PI / 180 );

	canvas.width = config.size;
	canvas.height = config.size;

	context.clearRect( 0, 0, config.size, config.size );

	context.beginPath();
	context.arc(
		radius,
		radius,
		radius - thickness / 2,
		angle,
		angle + Math.PI * 2
	);
	context.lineWidth = thickness;
	context.strokeStyle = config.backgroundColor;
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
	context.strokeStyle = config.textColor;
	context.stroke();

	context.beginPath();
	context.textAlign = 'center';
	context.font = '16px serif';
	context.fillText(
		value ? String( value ) : progress + '%',
		radius + 6.5,
		radius + 5
	);
	context.stroke();
}

function initCircleProgressBars() {
	const progressBars = jQuery(
		'.wp-block-getwid-circle-progress-bar:not(.getwid-init)'
	);

	progressBars.each( ( _index, progressBar ) => {
		const $progressBar = jQuery( progressBar );
		const $wrapper = $progressBar.find( `${ baseClass }__wrapper` );
		const canvas = $progressBar
			.find( `${ baseClass }__canvas` )
			.get( 0 ) as HTMLCanvasElement | undefined;
		const wrapper = $wrapper.get( 0 );

		if ( ! canvas || ! wrapper ) {
			return;
		}

		$progressBar.addClass( 'getwid-init' );

		const config = {
			backgroundColor:
				String( $wrapper.data( 'background-color' ) || '' ) ||
				'#eeeeee',
			textColor:
				String( $wrapper.data( 'text-color' ) || '' ) || '#0000ee',
			size: Number.parseFloat( String( $wrapper.data( 'size' ) ) ),
			thickness: $wrapper.data( 'thickness' ) as number | string,
		};
		const fillAmount = Number.parseInt(
			String( $wrapper.data( 'fill-amount' ) ),
			10
		);
		const isAnimated = Boolean( $wrapper.data( 'is-animated' ) );
		const value = $wrapper.data( 'value' ) as string | number | undefined;

		function drawAnimatedArcs() {
			let progress = 0;
			const fill = window.setInterval( () => {
				drawArcs( canvas, progress, value, config );

				progress++;
				if ( progress > fillAmount ) {
					window.clearInterval( fill );
				}
			}, 35 );
		}

		const waypoint = new window.Waypoint( {
			element: wrapper,
			handler: () => {
				if ( isAnimated ) {
					drawAnimatedArcs();
				} else {
					drawArcs( canvas, fillAmount, value, config );
				}

				waypoint.destroy();
			},
			offset: '100%',
		} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initCircleProgressBars();
	} );

	initCircleProgressBars();
} );
