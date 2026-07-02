import jQuery from 'jquery';

import type {
	CountUpOptions,
	CounterAttributes,
	WaypointConstructor,
} from './types';
import { getCountUpOptions } from './utils';

declare global {
	interface Window {
		Waypoint?: WaypointConstructor;
	}
}

const baseClass = '.wp-block-getwid-counter';

function getStringData( wrapper: JQuery, key: string, fallback = '' ) {
	const value = wrapper.data( key );

	return value === undefined ? fallback : String( value );
}

function getCounterAttributes( wrapper: JQuery ): CounterAttributes {
	return {
		start: getStringData( wrapper, 'start', '0' ),
		end: getStringData( wrapper, 'end', '100' ),
		decimalPlaces: getStringData( wrapper, 'decimal-places', '0' ),
		duration: getStringData( wrapper, 'duration', '3' ),
		useEasing: getStringData( wrapper, 'use-easing', 'true' ),
		useGrouping: getStringData( wrapper, 'use-grouping', 'true' ),
		separator: getStringData( wrapper, 'separator', ',' ),
		decimal: getStringData( wrapper, 'decimal', '.' ),
		easing: getStringData( wrapper, 'easing-fn', 'outExpo' ),
		numerals: getStringData( wrapper, 'numerals', 'default' ),
	};
}

function initCounterOptions( wrapper: JQuery ): CountUpOptions {
	return getCountUpOptions( getCounterAttributes( wrapper ) );
}

function initCounters() {
	const counters = jQuery( '.wp-block-getwid-counter:not(.getwid-init)' );
	const CountUp = window.CountUp;
	const Waypoint = window.Waypoint;

	if ( typeof CountUp !== 'function' || typeof Waypoint !== 'function' ) {
		return;
	}

	counters.each( ( _index, counter ) => {
		const $counter = jQuery( counter );
		const $wrapper = $counter.find( `${ baseClass }__wrapper` );
		const counterNumber = $counter
			.find( `${ baseClass }__number` )
			.get( 0 );
		const wrapper = $wrapper.get( 0 );

		if ( ! counterNumber || ! wrapper ) {
			return;
		}

		$counter.addClass( 'getwid-init' );

		const waypoint = new Waypoint( {
			element: counterNumber,
			handler: () => {
				new CountUp(
					counterNumber,
					Number.parseFloat(
						getStringData( $wrapper, 'end', '100' )
					),
					initCounterOptions( $wrapper )
				).start();

				waypoint.destroy();
			},
			offset: '100%',
		} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initCounters();
	} );

	initCounters();
} );
