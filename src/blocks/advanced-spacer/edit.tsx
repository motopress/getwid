import { useBlockProps } from '@wordpress/block-editor';
import { ResizableBox } from '@wordpress/components';
import clsx from 'clsx';

import Inspector from './inspector';
import type { AdvancedSpacerEditProps } from './types';

import './editor.scss';

function getUnit( value: string ) {
	return /\d+(\w+)/g.exec( value )?.[ 1 ] ?? 'px';
}

export default function Edit( props: AdvancedSpacerEditProps ) {
	const {
		attributes: { height, isHideDesktop, isHideTablet, isHideMobile },
		className,
		isSelected,
		setAttributes,
		toggleSelection,
	} = props;
	const units = getUnit( height );
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'is-selected': isSelected,
			'getwid-hide-desktop': isHideDesktop,
			'getwid-hide-tablet': isHideTablet,
			'getwid-hide-mobile': isHideMobile,
		} ),
	} );

	return (
		<div { ...blockProps }>
			<Inspector { ...props } />
			<ResizableBox
				size={ {
					height,
				} }
				minHeight="20"
				enable={ {
					top: false,
					right: false,
					bottom: units === 'px',
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				} }
				onResizeStop={ ( _event, _direction, _element, delta ) => {
					const value = parseInt( height, 10 ) + delta.height;

					setAttributes( {
						height: value + units,
					} );
					toggleSelection( true );
				} }
				onResizeStart={ () => {
					toggleSelection( false );
				} }
			/>
		</div>
	);
}
