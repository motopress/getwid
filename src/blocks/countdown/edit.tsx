import {
	BlockControls,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/server-side-render';
import $ from 'jquery';
import { GoogleFontLoader } from 'getwid-components';

import Inspector from './inspector';
import type { CountdownEditProps } from './types';

import './editor.scss';
import './style.scss';

const baseClass = 'wp-block-getwid-countdown';

function initCountdown( block: HTMLElement | null ) {
	if ( ! block ) {
		return;
	}

	const dataWrapper = $(
		`.${ baseClass }__content:not('.init-countdown')`,
		block
	);

	if ( ! dataWrapper.length ) {
		return;
	}

	dataWrapper.addClass( 'init-countdown' );

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

	const countdownElement = dataWrapper as JQuery< HTMLElement > & {
		countdown?: ( options: {
			until: string;
			format: string;
			onTick: () => void;
		} ) => void;
	};

	if ( typeof countdownElement.countdown === 'function' ) {
		countdownElement.countdown( {
			until: dateTo,
			format: dateFormat,
			onTick: () => {
				if ( backgroundColor ) {
					$( '.countdown-section', dataWrapper ).css(
						'background-color',
						backgroundColor
					);
				}
			},
		} );
	}
}

function Edit( props: CountdownEditProps ) {
	const { attributes, setAttributes } = props;
	const { fontGroupID, fontFamily, fontWeight, textAlignment } = attributes;
	const countdownRef = useRef< HTMLDivElement >( null );
	const shouldLoadGoogleFonts =
		!! fontFamily && [ '', 'google-fonts' ].includes( fontGroupID );

	useEffect( () => {
		const block = countdownRef.current;

		if ( ! block ) {
			return undefined;
		}

		const mutationObserver = new MutationObserver( () => {
			initCountdown( block );
		} );

		mutationObserver.observe( block, {
			childList: true,
			subtree: true,
		} );

		initCountdown( block );

		return () => mutationObserver.disconnect();
	}, [] );

	const alignmentControls = [
		{
			icon: 'editor-alignleft',
			title: __( 'Left', 'getwid' ),
			value: 'left',
		},
		{
			icon: 'editor-aligncenter',
			title: __( 'Center', 'getwid' ),
			value: 'center',
		},
		{
			icon: 'editor-alignright',
			title: __( 'Right', 'getwid' ),
			value: 'right',
		},
		{
			icon: 'editor-justify',
			title: __( 'Justify', 'getwid' ),
			value: 'justify',
		},
	];

	return (
		<>
			{ shouldLoadGoogleFonts && (
				<GoogleFontLoader
					fonts={ [
						{
							font: fontFamily,
							weights: [ fontWeight ],
						},
					] }
				/>
			) }
			<BlockControls>
				<ToolbarGroup>
					{ alignmentControls.map( ( control ) => (
						<ToolbarButton
							key={ control.value }
							icon={ control.icon }
							label={ control.title }
							isPressed={ textAlignment === control.value }
							onClick={ () =>
								setAttributes( {
									textAlignment: control.value,
								} )
							}
						/>
					) ) }
				</ToolbarGroup>
			</BlockControls>
			<Inspector { ...props } />
			<div { ...useBlockProps() }>
				<div ref={ countdownRef }>
					<ServerSideRender
						block="getwid/countdown"
						attributes={ attributes }
					/>
				</div>
			</div>
		</>
	);
}

export default withColors( { textColor: 'color' } )( Edit );
