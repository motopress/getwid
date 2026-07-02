import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { AdvancedSpacerAttributes } from './types';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< AdvancedSpacerAttributes > ) {
	const { height, isHideDesktop, isHideTablet, isHideMobile } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'getwid-hide-desktop': isHideDesktop,
			'getwid-hide-tablet': isHideTablet,
			'getwid-hide-mobile': isHideMobile,
		} ),
		style: { height },
		'aria-hidden': true,
	} );

	return <div { ...blockProps } />;
}
