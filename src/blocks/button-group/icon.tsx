import { Path, Rect, SVG } from '@wordpress/components';

export default function ButtonGroupIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M22,3v6H2V3H22 M24,1H0v10h24V1L24,1z" />
			<Rect x="4" y="5" width="16" height="2" />
			<Path d="M22,15v6H2v-6H22 M24,13H0v10h24V13L24,13z" />
			<Rect x="4" y="17" width="16" height="2" />
		</SVG>
	);
}
