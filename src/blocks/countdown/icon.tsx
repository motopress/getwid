import { Path, Polygon, SVG } from '@wordpress/components';

export default function CountdownIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Polygon points="12,14 12,10 10,10 10,14 10,16 12,16 16,16 16,14" />
			<Path d="M15,4.46V1l-5,4l5,4V6.59c2.93,1.19,5,4.06,5,7.41c0,4.41-3.59,8-8,8s-8-3.59-8-8H2c0,5.52,4.48,10,10,10s10-4.48,10-10C22,9.53,19.06,5.74,15,4.46z" />
		</SVG>
	);
}
