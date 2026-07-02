import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

type AnimationGroup = 'Entrance' | 'Exit' | 'Seeker' | 'Icon';

type AnimationSelectControlProps = {
	onChange: ( value: string ) => void;
	label?: string;
	help?: string;
	value?: string;
	allowAnimation?: AnimationGroup[];
};

const seekerAnimations = [
	{ value: 'bounce', label: __( 'Bounce', 'getwid' ) },
	{ value: 'flash', label: __( 'Flash', 'getwid' ) },
	{ value: 'pulse', label: __( 'Pulse', 'getwid' ) },
	{ value: 'rubberBand', label: __( 'Rubber Band', 'getwid' ) },
	{ value: 'shake', label: __( 'Shake', 'getwid' ) },
	{ value: 'headShake', label: __( 'Head Shake', 'getwid' ) },
	{ value: 'swing', label: __( 'Swing', 'getwid' ) },
	{ value: 'tada', label: __( 'Tada', 'getwid' ) },
	{ value: 'wobble', label: __( 'Wobble', 'getwid' ) },
	{ value: 'jello', label: __( 'Jello', 'getwid' ) },
	{ value: 'jackInTheBox', label: __( 'Jack In The Box', 'getwid' ) },
];

const iconHoverAnimations = [
	{ value: 'slideTop', label: __( 'Slide Top', 'getwid' ) },
	{ value: 'slideBottom', label: __( 'Slide Bottom', 'getwid' ) },
	{ value: 'slideLeft', label: __( 'Slide Left', 'getwid' ) },
	{ value: 'slideRight', label: __( 'Slide Right', 'getwid' ) },
	{ value: 'zoomSmall', label: __( 'Zoom Small', 'getwid' ) },
	{ value: 'zoomBig', label: __( 'Zoom Big', 'getwid' ) },
];

export default function AnimationSelectControl( {
	onChange,
	label,
	help,
	value,
	allowAnimation = [ 'Entrance', 'Exit', 'Seeker' ],
}: AnimationSelectControlProps ) {
	let animations = [ { value: '', label: __( 'None', 'getwid' ) } ];

	if ( allowAnimation.includes( 'Seeker' ) ) {
		animations = [ ...animations, ...seekerAnimations ];
	}

	if ( allowAnimation.includes( 'Icon' ) ) {
		animations = [ ...animations, ...iconHoverAnimations ];
	}

	return (
		<SelectControl
			label={ label }
			help={ help }
			value={ value }
			onChange={ onChange }
			options={ animations }
		/>
	);
}
