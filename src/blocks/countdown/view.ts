import $ from 'jquery';

type CountdownElement = JQuery< HTMLElement > & {
	countdown: ( options: {
		until: string;
		format: string;
		onTick: () => void;
	} ) => void;
};

function initCountdown() {
	const getwidCountdown = $( '.wp-block-getwid-countdown:not(.getwid-init)' );

	getwidCountdown.each( function () {
		const countdown = this;

		$( countdown ).addClass( 'getwid-init' );

		const dataWrapper = $( countdown ).find(
			'.wp-block-getwid-countdown__content'
		) as CountdownElement;
		const dateTime = dataWrapper.data( 'datetime' );
		const years = dataWrapper.data( 'years' );
		const months = dataWrapper.data( 'months' );
		const weeks = dataWrapper.data( 'weeks' );
		const days = dataWrapper.data( 'days' );
		const hours = dataWrapper.data( 'hours' );
		const minutes = dataWrapper.data( 'minutes' );
		const seconds = dataWrapper.data( 'seconds' );
		const backgroundColor = dataWrapper.data( 'bg-color' );
		const dateTo = dateTime === 'negative' ? '' : dateTime;
		let dateFormat = '';

		if ( years ) {
			dateFormat += 'Y';
		}
		if ( months ) {
			dateFormat += 'O';
		}
		if ( weeks ) {
			dateFormat += 'W';
		}
		if ( days ) {
			dateFormat += 'D';
		}
		if ( hours ) {
			dateFormat += 'H';
		}
		if ( minutes ) {
			dateFormat += 'M';
		}
		if ( seconds ) {
			dateFormat += 'S';
		}

		dataWrapper.countdown( {
			until: dateTo,
			format: dateFormat,
			onTick: () => {
				const section = $( '.countdown-section', dataWrapper );

				if ( backgroundColor ) {
					section.css( 'background-color', backgroundColor );
				}
			},
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initCountdown );
	initCountdown();
} );
