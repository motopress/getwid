import { Path, Polygon, Rect, SVG } from '@wordpress/components';

export default function ContentSliderIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M0,0v6v2v16h24V8V6V0H0z M22,22H2V8h20V22z M2,6V2h20v4H2z" />
			<Rect x="3" y="3" width="2" height="2" />
			<Rect x="6" y="3" width="2" height="2" />
			<Rect x="9" y="3" width="2" height="2" />
			<Polygon points="14.71,20.71 20.41,15 14.71,9.29 13.29,10.71 17.59,15 13.29,19.29" />
			<Polygon points="10.71,19.29 6.41,15 10.71,10.71 9.29,9.29 3.59,15 9.29,20.71" />
		</SVG>
	);
}
