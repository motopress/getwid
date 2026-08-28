import {
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import clsx from 'clsx';
import jQuery from 'jquery';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import type { IconBoxEditProps } from './types';
import {
	animateElement,
	getBlockClassName,
	getIconContainerClassName,
	prepareWrapperStyle,
} from './utils';

import './editor.scss';
import './style.scss';

const baseClass = 'wp-block-getwid-icon-box';
const template = [
	[
		'core/heading',
		{ level: 3, placeholder: __( 'Write heading…', 'getwid' ) },
	],
	[ 'core/paragraph', { placeholder: __( 'Write text…', 'getwid' ) } ],
];

function Edit( props: IconBoxEditProps ) {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		backgroundColor,
		textColor,
	} = props;
	const {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		icon,
		textAlignment,
		layout,
		iconPosition,
		iconStyle,
		link,
		hoverAnimation,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, getBlockClassName( attributes ), {
			'is-selected': isSelected,
		} ),
		'data-animation': hoverAnimation || undefined,
		onMouseEnter: ( event: { currentTarget: HTMLElement } ) => {
			if ( hoverAnimation ) {
				animateElement(
					jQuery( event.currentTarget ).find(
						`.${ baseClass }__icon-wrapper`
					) as JQuery< HTMLElement >,
					{ animation: hoverAnimation }
				);
			}
		},
	} );
	const iconContainerClassName = clsx(
		`${ baseClass }__icon-container`,
		getIconContainerClassName( attributes )
	);
	const iconContainerStyle = {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
	};
	const iconWrapperProps = {
		className: clsx( `${ baseClass }__icon-wrapper`, {
			'has-background':
				!! backgroundColor.color && iconStyle === 'stacked',
			[ backgroundColor.class || '' ]:
				!! backgroundColor.class && iconStyle === 'stacked',
			'has-text-color': !! textColor.color,
			[ textColor.class || '' ]: textColor.class,
		} ),
		style: prepareWrapperStyle( props, 'edit' ),
	};

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div
					style={ iconContainerStyle }
					className={ iconContainerClassName }
				>
					{ link ? (
						<a
							href={ link }
							{ ...iconWrapperProps }
							onClick={ ( event ) => event.preventDefault() }
						>
							<i className={ icon } />
						</a>
					) : (
						<div { ...iconWrapperProps }>
							<i className={ icon } />
						</div>
					) }
				</div>
				<div className={ `${ baseClass }__content` }>
					<InnerBlocks
						template={ template }
						templateInsertUpdatesSelection={ false }
						templateLock={ false }
					/>
				</div>
			</div>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="align-left"
						label={ __( 'Align Icon Left', 'getwid' ) }
						isPressed={ layout === 'left' }
						onClick={ () =>
							setAttributes( {
								layout: layout === 'left' ? undefined : 'left',
							} )
						}
					/>
					<ToolbarButton
						icon="align-right"
						label={ __( 'Align Icon Right', 'getwid' ) }
						isPressed={ layout === 'right' }
						onClick={ () =>
							setAttributes( {
								layout:
									layout === 'right' ? undefined : 'right',
							} )
						}
					/>
				</ToolbarGroup>
				<AlignmentToolbar
					value={ textAlignment }
					onChange={ ( nextTextAlignment ) =>
						setAttributes( {
							textAlignment: nextTextAlignment,
						} )
					}
				/>
			</BlockControls>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
