import { Fragment } from '@wordpress/element';
import type { ReactElement } from 'react';

import type { SectionAttributes } from './types';
import dividers from './dividers-list';

type DividerProps = {
	attributes: SectionAttributes;
	baseClass: string;
};

function fallbackDivider( color: string, height?: string ): ReactElement {
	return (
		<svg
			style={ { height: height || undefined } }
			x="0px"
			y="0px"
			viewBox="0 0 1000 100"
			preserveAspectRatio="none"
			className="wp-block-getwid-section__divider-svg"
		>
			<polygon fill={ color } points="0,0 1000,0 1000,100 0,100" />
		</svg>
	);
}

export default function Dividers( { attributes, baseClass }: DividerProps ) {
	const {
		dividerTop,
		dividersTopHeight,
		dividerTopColor = 'white',
		dividerBottom,
		dividersBottomHeight,
		dividerBottomColor = 'white',
	} = attributes;

	function getDividerRenderer( dividerName?: string ) {
		return dividerName
			? dividers[ dividerName ] ?? fallbackDivider
			: fallbackDivider;
	}

	const renderTopDivider = getDividerRenderer( dividerTop );
	const renderBottomDivider = getDividerRenderer( dividerBottom );

	return (
		<Fragment>
			{ dividerTop && (
				<div className={ `${ baseClass }__divider is-top-divider` }>
					{ renderTopDivider( dividerTopColor, dividersTopHeight ) }
				</div>
			) }

			{ dividerBottom && (
				<div className={ `${ baseClass }__divider is-bottom-divider` }>
					{ renderBottomDivider(
						dividerBottomColor,
						dividersBottomHeight
					) }
				</div>
			) }
		</Fragment>
	);
}
