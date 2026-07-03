import { Path, Polygon, SVG } from '@wordpress/components';

export default function ContactFormIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Polygon points="9,0 0,0 0,2 9,2 9,0" />
			<Polygon points="9,4 0,4 0,6 9,6 9,4" />
			<Polygon points="9,8 0,8 0,10 9,10 9,8" />
			<Path d="M22,14v8H2v-8H22 M24,12H0v12h24V12L24,12z" />
			<Path d="M11,0v10h13V0H11z M20.18,2L17.5,4.11L14.82,2H20.18z M13,8V3.11l4.5,3.55L22,3.11V8H13z" />
		</SVG>
	);
}
