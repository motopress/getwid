/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	SelectControl
} = wp.components;

export default function GetwidAnimationSelectControl (
	{
		onChange,
		label,
		value,
		allowAnimation = ['Entrance','Exit','Seeker']
	} ) {

	let animations = [
		{value: '', label: __('None', 'getwid')},
	];

	const entranceAnimations = [
		// Bounce
		{value: 'bounceIn', label: __('Bounce In', 'getwid')},
		{value: 'bounceInDown', label: __('Bounce In Down', 'getwid')},
		{value: 'bounceInDownShort', label: __('Bounce In Down Short', 'getwid')},
		{value: 'bounceInLeft', label: __('Bounce In Left', 'getwid')},
		{value: 'bounceInLeftShort', label: __('Bounce In Left Short', 'getwid')},
		{value: 'bounceInRight', label: __('Bounce In Right', 'getwid')},
		{value: 'bounceInRightShort', label: __('Bounce In Right Short', 'getwid')},
		{value: 'bounceInUp', label: __('Bounce In Up', 'getwid')},
		{value: 'bounceInUpShort', label: __('Bounce In Up Short', 'getwid')},
		// Fade
		{value: 'fadeIn', label: __('Fade In', 'getwid')},
		{value: 'fadeInDown', label: __('Fade In Down', 'getwid')},
		{value: 'fadeInDownShort', label: __('Fade In Down Short', 'getwid')},
		{value: 'fadeInDownBig', label: __('Fade In Down Big', 'getwid')},
		{value: 'fadeInLeft', label: __('Fade In Left', 'getwid')},
		{value: 'fadeInLeftShort', label: __('Fade In Left Short', 'getwid')},
		{value: 'fadeInLeftBig', label: __('Fade In Left Big', 'getwid')},
		{value: 'fadeInRight', label: __('Fade In Right', 'getwid')},
		{value: 'fadeInRightShort', label: __('Fade In Right Short', 'getwid')},
		{value: 'fadeInRightBig', label: __('Fade In Right Big', 'getwid')},
		{value: 'fadeInUp', label: __('Fade In Up', 'getwid')},
		{value: 'fadeInUpShort', label: __('Fade In Up Short', 'getwid')},
		{value: 'fadeInUpBig', label: __('Fade In Up Big', 'getwid')},
		// Flip
		{value: 'flipInX', label: __('Flip In X', 'getwid')},
		{value: 'flipInY', label: __('Flip In Y', 'getwid')},
		// Lightspeed
		{value: 'lightSpeedIn', label: __('Light Speed In', 'getwid')},
		{value: 'lightSpeedInShort', label: __('Light Speed In Short', 'getwid')},
		// Rotate
		{value: 'rotateIn', label: __('Rotate In', 'getwid')},
		{value: 'rotateInDownLeft', label: __('Rotate In Down Left', 'getwid')},
		{value: 'rotateInDownRight', label: __('Rotate In Down Right', 'getwid')},
		{value: 'rotateInUpLeft', label: __('Rotate In Up Left', 'getwid')},
		{value: 'rotateInUpRight', label: __('Rotate In Up Right', 'getwid')},
		// Zoom
		{value: 'zoomIn', label: __('Zoom In', 'getwid')},
		{value: 'zoomInDown', label: __('Zoom In Down', 'getwid')},
		{value: 'zoomInLeft', label: __('Zoom In Left', 'getwid')},
		{value: 'zoomInRight', label: __('Zoom In Right', 'getwid')},
		{value: 'zoomInUp', label: __('Zoom In Up', 'getwid')},
		// Slide
		{value: 'slideInDown', label: __('Slide In Down', 'getwid')},
		{value: 'slideInDownShort', label: __('Slide In Down Short', 'getwid')},
		{value: 'slideInLeft', label: __('Slide In Left', 'getwid')},
		{value: 'slideInLeftShort', label: __('Slide In Left Short', 'getwid')},
		{value: 'slideInRight', label: __('Slide In Right', 'getwid')},
		{value: 'slideInRightShort', label: __('Slide In Right Short', 'getwid')},
		{value: 'slideInUp', label: __('Slide In Up', 'getwid')},
		{value: 'slideInUpShort', label: __('Slide In Up Short', 'getwid')},
		// Specials
		{value: 'rollIn', label: __('Roll In', 'getwid')},
	];
	const exitAnimations = [
		// Bounce
		{value: 'bounceOut', label: __('Bounce Out', 'getwid')},
		{value: 'bounceOutDown', label: __('Bounce Out Down', 'getwid')},
		{value: 'bounceOutLeft', label: __('Bounce Out Left', 'getwid')},
		{value: 'bounceOutRight', label: __('Bounce Out Right', 'getwid')},
		{value: 'bounceOutUp', label: __('Bounce Out Up', 'getwid')},
		// Fade
		{value: 'fadeOut', label: __('Fade Out', 'getwid')},
		{value: 'fadeOutDown', label: __('Fade Out Down', 'getwid')},
		{value: 'fadeOutDownBig', label: __('Fade Out Down Big', 'getwid')},
		{value: 'fadeOutLeft', label: __('Fade Out Left', 'getwid')},
		{value: 'fadeOutLeftBig', label: __('Fade Out Left Big', 'getwid')},
		{value: 'fadeOutRight', label: __('Fade Out Right', 'getwid')},
		{value: 'fadeOutRightBig', label: __('Fade Out Right Big', 'getwid')},
		{value: 'fadeOutUp', label: __('Fade Out Up', 'getwid')},
		{value: 'fadeOutUpBig', label: __('Fade Out Up Big', 'getwid')},
		// Flip
		{value: 'flipOutX', label: __('Flip Out X', 'getwid')},
		{value: 'flipOutY', label: __('Flip Out Y', 'getwid')},
		// Lightspeed
		{value: 'lightSpeedOut', label: __('Light Speed Out', 'getwid')},
		// Rotate
		{value: 'rotateOut', label: __('Rotate Out', 'getwid')},
		{value: 'rotateOutDownLeft', label: __('Rotate Out Down Left', 'getwid')},
		{value: 'rotateOutDownRight', label: __('Rotate Out Down Right', 'getwid')},
		{value: 'rotateOutUpLeft', label: __('Rotate Out Up Left', 'getwid')},
		{value: 'rotateOutUpRight', label: __('Rotate Out Up Right', 'getwid')},
		// Zoom
		{value: 'zoomOut', label: __('Zoom Out', 'getwid')},
		{value: 'zoomOutDown', label: __('Zoom Out Down', 'getwid')},
		{value: 'zoomOutLeft', label: __('Zoom Out Left', 'getwid')},
		{value: 'zoomOutRight', label: __('Zoom Out Right', 'getwid')},
		{value: 'zoomOutUp', label: __('Zoom Out Up', 'getwid')},
		// Slide
		{value: 'slideOutDown', label: __('Slide Out Down', 'getwid')},
		{value: 'slideOutLeft', label: __('Slide Out Left', 'getwid')},
		{value: 'slideOutRight', label: __('Slide Out Right', 'getwid')},
		{value: 'slideOutUp', label: __('Slide Out Up', 'getwid')},
		{value: 'heartBeat', label: __('Heart Beat', 'getwid')},
		// Specials
		{value: 'hinge', label: __('Hinge', 'getwid')},
		{value: 'rollOut', label: __('Roll Out', 'getwid')},
	];
	const seekerAnimations = [
		{value: 'bounce', label: __('Bounce', 'getwid')},
		{value: 'flash', label: __('Flash', 'getwid')},
		{value: 'pulse', label: __('Pulse', 'getwid')},
		{value: 'rubberBand', label: __('Rubber Band', 'getwid')},
		{value: 'shake', label: __('Shake', 'getwid')},
		{value: 'headShake', label: __('Head Shake', 'getwid')},
		{value: 'swing', label: __('Swing', 'getwid')},
		{value: 'tada', label: __('Tada', 'getwid')},
		{value: 'wobble', label: __('Wobble', 'getwid')},
		{value: 'jello', label: __('Jello', 'getwid')},
		// Specials
		{value: 'jackInTheBox', label: __('Jack In The Box', 'getwid')},
	];

	const iconHoverAnimations = [
        {value: 'slideTop', label: __('Slide Top', 'getwid')},
        {value: 'slideBottom', label: __('Slide Bottom', 'getwid')},
        {value: 'slideLeft', label: __('Slide Left', 'getwid')},
        {value: 'slideRight', label: __('Slide Right', 'getwid')},
        {value: 'zoomSmall', label: __('Zoom Small', 'getwid')},
        {value: 'zoomBig', label: __('Zoom Big', 'getwid')},
	];
	
	if (allowAnimation.includes('Entrance')) {
		animations = [...animations, ...entranceAnimations];
	}

	if (allowAnimation.includes('Exit')) {
		animations = [...animations, ...exitAnimations];
	}

	if (allowAnimation.includes('Seeker')) {
		animations = [...animations, ...seekerAnimations];
	}

	if (allowAnimation.includes('Icon')) {
		animations = [...animations, ...iconHoverAnimations];
	}

	return (
		<SelectControl
			label={label}
			value={value}
			onChange={onChange}
			options={animations}
		/>
	);
}
