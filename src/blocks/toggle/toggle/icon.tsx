import { Path, SVG } from '@wordpress/components';

export default function ToggleIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g>
				<Path d="M0,0v6h24V0H0z M22,4H2V2h20V4z" />
			</g>
			<g>
				<Path d="M0,18v6h24v-6H0z M22,22H2v-2h20V22z" />
			</g>
			<g>
				<Path d="M0,8v8h24V8H0z M22,14H2v-4h20V14z" />
			</g>
		</SVG>
	);
}
