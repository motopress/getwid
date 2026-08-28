import { BaseControl, Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import './editor.scss';

type BackgroundType = 'color' | 'image' | 'gradient' | 'slider' | 'video';

type CustomBackgroundControlProps< T extends BackgroundType > = {
	state: T;
	label?: string;
	stateName: string;
	onChangeBackgroundType: ( stateName: string, value: T ) => void;
	types?: T[];
};

const defaultTypes: BackgroundType[] = [
	'color',
	'image',
	'gradient',
	'slider',
	'video',
];

const colorIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="20"
		height="20"
		viewBox="0 0 20 20"
	>
		<path d="M3,16h14c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H3c-0.55,0-1-0.45-1-1v0C2,16.45,2.45,16,3,16z" />
		<path d="M9.05,13.95L13.3,9.7c0.39-0.39,0.39-1.02,0-1.41L9.05,4.05L8.34,3.34L7.63,2.63c-0.39-0.39-1.02-0.39-1.41,0L6.22,2.64 c-0.39,0.39-0.39,1.02,0,1.41l0.7,0.7L3.39,8.3C3,8.69,3,9.31,3.39,9.7l4.24,4.25C8.02,14.34,8.66,14.34,9.05,13.95z M9.04,6.87 L11.17,9H5.51l2.13-2.13C8.02,6.49,8.66,6.49,9.04,6.87z" />
		<path d="M13,13c0,0.55,0.45,1,1,1s1-0.45,1-1s-1-3-1-3S13,12.45,13,13z" />
	</svg>
);

const gradientIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="20"
		height="20"
		viewBox="0 0 20 20"
	>
		<path d="M2,3v14c0,0.55,0.45,1,1,1h14c0.55,0,1-0.45,1-1V3c0-0.55-0.45-1-1-1H3C2.45,2,2,2.45,2,3z M15,16H4L16,4v11 C16,15.55,15.55,16,15,16z" />
	</svg>
);

const options = {
	color: {
		icon: colorIcon,
		label: __( 'Color', 'getwid' ),
	},
	image: {
		icon: 'format-image',
		label: __( 'Image', 'getwid' ),
	},
	gradient: {
		icon: gradientIcon,
		label: __( 'Gradient', 'getwid' ),
	},
	slider: {
		icon: 'images-alt2',
		label: __( 'Slider', 'getwid' ),
	},
	video: {
		icon: 'video-alt3',
		label: __( 'Video', 'getwid' ),
	},
};

export default function CustomBackgroundControl< T extends BackgroundType >( {
	state,
	label,
	stateName,
	onChangeBackgroundType,
	types = defaultTypes as T[],
}: CustomBackgroundControlProps< T > ) {
	const controlId = label
		? `getwid-section-background-control-${ stateName }`
		: undefined;

	return (
		<BaseControl
			id={ controlId }
			label={ label }
			className="components-getwid-background-types-control"
			__nextHasNoMarginBottom
		>
			<ButtonGroup className="components-getwid-background-types-group">
				{ types.map( ( type ) => (
					<Button
						key={ type }
						icon={ options[ type ].icon }
						label={ options[ type ].label }
						className={ clsx(
							'wp-block-getwid-background-types-icon',
							{
								'is-active': type === state,
							}
						) }
						onClick={ () =>
							onChangeBackgroundType( stateName, type )
						}
					/>
				) ) }
			</ButtonGroup>
		</BaseControl>
	);
}
