import { Fragment } from '@wordpress/element';

import type { SectionAttributes } from './types';

type DividerProps = {
	attributes: SectionAttributes;
	baseClass: string;
};

function fallbackDivider( color: string, height?: string ) {
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

	return (
		<Fragment>
			{ dividerTop && (
				<div className={ `${ baseClass }__divider is-top-divider` }>
					{ fallbackDivider( dividerTopColor, dividersTopHeight ) }
				</div>
			) }
			{ dividerBottom && (
				<div className={ `${ baseClass }__divider is-bottom-divider` }>
					{ fallbackDivider(
						dividerBottomColor,
						dividersBottomHeight
					) }
				</div>
			) }
		</Fragment>
	);
}
