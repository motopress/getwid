import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import clsx from 'clsx';
import jQuery from 'jquery';

import Inspector from './inspector';
import type { IconEditProps } from './types';
import { animateElement, getIconClassName, prepareWrapperStyle } from './utils';

import './editor.scss';
import './style.scss';

const baseClass = 'wp-block-getwid-icon';

function Edit( props: IconEditProps ) {
	const { attributes, setAttributes, className, backgroundColor, textColor } =
		props;
	const {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		icon,
		iconStyle,
		link,
		hoverAnimation,
		textAlignment,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, getIconClassName( attributes ) ),
	} );
	function onIconMouseEnter( event: { currentTarget: HTMLElement } ) {
		if ( hoverAnimation ) {
			animateElement( jQuery( event.currentTarget ), {
				animation: hoverAnimation,
			} );
		}
	}

	const wrapperProps = {
		className: clsx( `${ baseClass }__wrapper`, {
			'getwid-animation': !! hoverAnimation,
			'has-background':
				!! backgroundColor.color && iconStyle === 'stacked',
			[ backgroundColor.class || '' ]:
				!! backgroundColor.class && iconStyle === 'stacked',
			'has-text-color': !! textColor.color,
			[ textColor.class || '' ]: textColor.class,
		} ),
		style: {
			...prepareWrapperStyle( props, 'edit' ),
			...{
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
			},
		},
		'data-animation': hoverAnimation || undefined,
		onMouseEnter: onIconMouseEnter,
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ textAlignment }
					onChange={ ( nextTextAlignment ) =>
						setAttributes( {
							textAlignment: nextTextAlignment,
						} )
					}
				/>
			</BlockControls>
			<Inspector { ...props } />

			<div { ...blockProps }>
				{ link ? (
					<a
						href={ link }
						{ ...wrapperProps }
						onClick={ ( event ) => event.preventDefault() }
					>
						<i className={ icon } />
					</a>
				) : (
					<div { ...wrapperProps }>
						<i className={ icon } />
					</div>
				) }
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
