/**
* External dependencies
*/
import classnames from 'classnames';
import './editor.scss';
// import {map} from 'lodash';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Dashicon,
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	select,
	dispatch
} = wp.data;


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			attributes: {
				align
			},
			setAttributes,
			className,
		} = this.props;
		
		const current_post_type = select("core/editor").getCurrentPostType();
		const clientId = select('core/editor').getSelectedBlockClientId();
		
		// 'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect y="45" fill="#505050" width="64" height="3"/><rect y="52" fill="#505050" width="64" height="2"/><rect y="57" fill="#505050" width="64" height="2"/><rect y="62" fill="#505050" width="40" height="2"/><path fill="#505050" d="M62,2v36H2V2H62 M64,0H0v40h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="31.4" x2="2.7" y2="30.1"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5513,2.2756" x1="4.4" y1="28.6" x2="19.1" y2="16"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20,15.3 21.5,14 23,15.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.0432,2.0216" x1="24.5" y1="16.6" x2="37.6" y2="27.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.4,28.5 39.9,29.8 41.4,28.5 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.2164,1.6082" x1="42.6" y1="27.4" x2="45.7" y2="24.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.3,24.3 47.8,23 49.3,24.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5793,2.2897" x1="51" y1="25.8" x2="60.6" y2="34"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.5" y1="34.7" x2="63" y2="36"/></svg>,
		// 'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="10" y="13" fill="#505050" width="44" height="3"/><rect x="10" y="20" fill="#505050" width="30" height="2"/><path fill="#505050" d="M62,2v60H2V2H62 M64,0H0v64h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="50.3" x2="2.6" y2="48.9"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.8051,1.9026" x1="3.9" y1="47.6" x2="19.4" y2="32.1"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20.1,31.4 21.5,30 22.9,31.4 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.401,2.2005" x1="24.5" y1="33" x2="37.7" y2="46.2"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.5,47 39.9,48.4 41.3,47 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.6018,1.8009" x1="42.6" y1="45.7" x2="45.7" y2="42.5"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.4,41.9 47.8,40.5 49.2,41.9 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.5014,1.7507" x1="50.4" y1="43.1" x2="61" y2="53.6"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.6" y1="54.3" x2="63" y2="55.7"/><circle fill="#505050" cx="53" cy="31" r="3"/></svg>,
		// 'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="45" y="23" fill="#505050" width="19" height="3"/><rect x="45" y="30" fill="#505050" width="19" height="2"/><rect x="45" y="35" fill="#505050" width="19" height="2"/><rect x="45" y="40" fill="#505050" width="13" height="2"/><path fill="#505050" d="M38,14v36H2V14H38 M40,12H0v40h40V12L40,12z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="43.9" x2="2.6" y2="42.5"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.8809,1.9405" x1="4" y1="41.1" x2="11.5" y2="33.6"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="12.2,32.9 13.6,31.5 15,32.9 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.4039,1.702" x1="16.2" y1="34.1" x2="22.8" y2="40.7"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="23.4,41.3 24.9,42.8 26.3,41.3 "/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="28.3,39.3 29.7,37.9 31.1,39.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5806,2.2903" x1="32.7" y1="40.9" x2="36.8" y2="45"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="37.6" y1="45.8" x2="39" y2="47.2"/></svg>,
		// 'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="14" y="18.96" fill="#505050" width="36" height="3"/><rect x="14" y="26.96" fill="#505050" width="36" height="2"/><rect x="14" y="31.96" fill="#505050" width="36" height="2"/><rect x="14" y="36.96" fill="#505050" width="36" height="2"/><rect x="14" y="41.96" fill="#505050" width="26" height="2"/><polygon fill="#505050" points="18,12.11 17.29,11.41 16.24,12.47 15.19,11.41 14.48,12.11 15.54,13.18 14.48,14.26 15.19,14.96 16.24,13.9 17.29,14.96 18,14.26 16.94,13.18 "/><polygon fill="#505050" points="39,12.11 38.29,11.41 37.24,12.47 36.19,11.41 35.48,12.11 36.54,13.18 35.48,14.26 36.19,14.96 37.24,13.9 38.29,14.96 39,14.26 37.94,13.18 "/><polygon fill="#505050" points="60,12.11 59.29,11.41 58.24,12.47 57.19,11.41 56.48,12.11 57.54,13.18 56.48,14.26 57.19,14.96 58.24,13.9 59.29,14.96 60,14.26 58.94,13.18 "/><polygon fill="#505050" points="7.48,6.11 6.77,5.41 5.72,6.47 4.67,5.41 3.96,6.11 5.02,7.18 3.96,8.26 4.67,8.96 5.72,7.9 6.77,8.96 7.48,8.26 6.42,7.18 "/><polygon fill="#505050" points="28.48,6.11 27.77,5.41 26.72,6.47 25.67,5.41 24.96,6.11 26.02,7.18 24.96,8.26 25.67,8.96 26.72,7.9 27.77,8.96 28.48,8.26 27.42,7.18 "/><polygon fill="#505050" points="49.48,6.11 48.77,5.41 47.72,6.47 46.67,5.41 45.96,6.11 47.02,7.18 45.96,8.26 46.67,8.96 47.72,7.9 48.77,8.96 49.48,8.26 48.42,7.18 "/><polygon fill="#505050" points="18,54.11 17.29,53.41 16.24,54.47 15.19,53.41 14.48,54.11 15.54,55.18 14.48,56.26 15.19,56.96 16.24,55.9 17.29,56.96 18,56.26 16.94,55.18 "/><polygon fill="#505050" points="39,54.11 38.29,53.41 37.24,54.47 36.19,53.41 35.48,54.11 36.54,55.18 35.48,56.26 36.19,56.96 37.24,55.9 38.29,56.96 39,56.26 37.94,55.18 "/><polygon fill="#505050" points="60,54.11 59.29,53.41 58.24,54.47 57.19,53.41 56.48,54.11 57.54,55.18 56.48,56.26 57.19,56.96 58.24,55.9 59.29,56.96 60,56.26 58.94,55.18 "/><polygon fill="#505050" points="7.48,48.11 6.77,47.41 5.72,48.47 4.67,47.41 3.96,48.11 5.02,49.18 3.96,50.26 4.67,50.96 5.72,49.9 6.77,50.96 7.48,50.26 6.42,49.18 "/><polygon fill="#505050" points="28.48,48.11 27.77,47.41 26.72,48.47 25.67,47.41 24.96,48.11 26.02,49.18 24.96,50.26 25.67,50.96 26.72,49.9 27.77,50.96 28.48,50.26 27.42,49.18 "/><polygon fill="#505050" points="49.48,48.11 48.77,47.41 47.72,48.47 46.67,47.41 45.96,48.11 47.02,49.18 45.96,50.26 46.67,50.96 47.72,49.9 48.77,50.96 49.48,50.26 48.42,49.18 "/><polygon fill="#505050" points="60,25.66 59.29,24.96 58.24,26.02 57.19,24.96 56.48,25.66 57.54,26.74 56.48,27.81 57.19,28.51 58.24,27.45 59.29,28.51 60,27.81 58.94,26.74 "/><polygon fill="#505050" points="7.48,19.66 6.77,18.96 5.72,20.02 4.67,18.96 3.96,19.66 5.02,20.74 3.96,21.81 4.67,22.51 5.72,21.45 6.77,22.51 7.48,21.81 6.42,20.74 "/><polygon fill="#505050" points="60,39.11 59.29,38.41 58.24,39.47 57.19,38.41 56.48,39.11 57.54,40.18 56.48,41.26 57.19,41.96 58.24,40.9 59.29,41.96 60,41.26 58.94,40.18 "/><polygon fill="#505050" points="7.48,33.11 6.77,32.41 5.72,33.47 4.67,32.41 3.96,33.11 5.02,34.18 3.96,35.26 4.67,35.96 5.72,34.9 6.77,35.96 7.48,35.26 6.42,34.18 "/><path fill="#505050" d="M62,2v60H2V2H62 M64,0H0v64h64V0L64,0z"/></svg>,
		const templates = [
			{
				'title': __('Classic', 'getwid'),
				'icon': 				
					<svg version="1.1" width="48" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					viewBox="0 0 48 48" style={{'enable-background':'new 0 0 48 48'}}>
						<path d="M45.99,0H2.01C0.9,0,0,0.9,0,2.01v22.98C0,26.1,0.9,27,2.01,27h43.98C47.1,27,48,26.1,48,24.99V2.01C48,0.9,47.1,0,45.99,0z M45.99,25L2,24.99L2.01,2h43.98V25z"/>
						<path d="M5,19.66c0.23,0,0.46-0.08,0.65-0.24l1.14-0.98c0.42-0.36,0.47-0.99,0.11-1.41c-0.36-0.42-0.99-0.47-1.41-0.11L4.35,17.9 c-0.42,0.36-0.47,0.99-0.11,1.41C4.44,19.54,4.72,19.66,5,19.66z"/>
						<path d="M28.61,19.94c0.23,0.2,0.5,0.34,0.8,0.43c0.09,0.03,0.19,0.04,0.28,0.04c0.42,0,0.8-0.29,0.93-0.73 c0.16-0.53-0.18-1.11-0.71-1.27l-1.94-1.67c-0.42-0.36-1.05-0.32-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L28.61,19.94z"/>
						<path d="M24.35,16.27c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-2.32-2 c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L24.35,16.27z"/>
						<path d="M31.51,18.7c0.2,0.23,0.48,0.35,0.76,0.35c0.23,0,0.46-0.08,0.65-0.24l2.2-1.89c0.47-0.29,0.63-0.9,0.34-1.37 c-0.29-0.47-0.9-0.63-1.37-0.34c-0.1,0.06-0.19,0.13-0.28,0.21l-2.18,1.88C31.2,17.65,31.15,18.28,31.51,18.7z"/>
						<path d="M38.88,19.85c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-2.32-2 c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L38.88,19.85z"/>
						<path d="M8.46,16.68c0.23,0,0.46-0.08,0.65-0.24l2.32-2c0.42-0.36,0.47-0.99,0.1-1.41c-0.36-0.42-0.99-0.47-1.41-0.1l-2.32,2 c-0.42,0.36-0.47,0.99-0.1,1.41C7.9,16.56,8.18,16.68,8.46,16.68z"/>
						<path d="M19.71,12.28c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-2.32-2 c-0.42-0.36-1.05-0.31-1.41,0.11s-0.31,1.05,0.11,1.41L19.71,12.28z"/>
						<path d="M13.1,12.68c0.23,0,0.46-0.08,0.65-0.24l2.32-2c0.42-0.36,0.47-0.99,0.1-1.41s-0.99-0.47-1.41-0.1l-2.32,2 c-0.42,0.36-0.47,0.99-0.1,1.41C12.54,12.56,12.82,12.68,13.1,12.68z"/>
						<path d="M42.35,22.83c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-1.14-0.98 c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L42.35,22.83z"/>
						<path d="M1.52,33h27.96c0.84,0,1.52-0.67,1.52-1.5S30.32,30,29.48,30H1.52C0.68,30,0,30.67,0,31.5S0.68,33,1.52,33z"/>
						<path d="M47,36H1c-0.55,0-1,0.45-1,1s0.45,1,1,1h46c0.55,0,1-0.45,1-1S47.55,36,47,36z"/>
						<path d="M47,41H1c-0.55,0-1,0.45-1,1s0.45,1,1,1h46c0.55,0,1-0.45,1-1S47.55,41,47,41z"/>
						<path d="M30,46H1c-0.55,0-1,0.45-1,1s0.45,1,1,1h29c0.55,0,1-0.45,1-1S30.55,46,30,46z"/>
						<circle cx="30" cy="10" r="2"/>
					</svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-image', {
						linkTo: 'post'
					}),
					wp.blocks.createBlock('getwid/template-post-title', {
						linkTo: 'post',
						headerTag: 'h3',
					}),
					wp.blocks.createBlock('getwid/template-post-meta'),
					wp.blocks.createBlock('getwid/template-post-content'),
					wp.blocks.createBlock('getwid/template-post-button'),
				]
			},
			{
				'title': __('Image in background', 'getwid'),
				'icon': 				
					<svg version="1.1" width="48" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					viewBox="0 0 48 48" style={{'enable-background':'new 0 0 48 48'}}>
						<path d="M45.99,0H2.01C0.9,0,0,0.9,0,2.01v43.98C0,47.1,0.9,48,2.01,48h43.98C47.1,48,48,47.1,48,45.99V2.01C48,0.9,47.1,0,45.99,0z M45.99,46L2,45.99L2.01,2h43.98V46z"/>
						<path d="M5,36.66c0.23,0,0.46-0.08,0.65-0.24l1.14-0.98c0.42-0.36,0.47-0.99,0.11-1.41c-0.36-0.42-0.99-0.47-1.41-0.11L4.35,34.9 c-0.42,0.36-0.47,0.99-0.11,1.41C4.44,36.54,4.72,36.66,5,36.66z"/>
						<path d="M23.34,29.76c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41l2.32,2c0.19,0.16,0.42,0.24,0.65,0.24 c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41L23.34,29.76z"/>
						<path d="M14.77,25.92l-2.32,2c-0.42,0.36-0.47,0.99-0.1,1.41c0.2,0.23,0.48,0.35,0.76,0.35c0.23,0,0.46-0.08,0.65-0.24l2.32-2 c0.42-0.36,0.47-0.99,0.1-1.41C15.82,25.61,15.19,25.56,14.77,25.92z"/>
						<path d="M10.13,29.92l-2.32,2c-0.42,0.36-0.47,0.99-0.1,1.41c0.2,0.23,0.48,0.35,0.76,0.35c0.23,0,0.46-0.08,0.65-0.24l2.32-2 c0.42-0.36,0.47-0.99,0.1-1.41C11.18,29.61,10.55,29.56,10.13,29.92z"/>
						<path d="M30,35.46c-0.04-0.01-0.07-0.03-0.09-0.04l-1.94-1.67c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41 l1.94,1.67c0.23,0.2,0.5,0.34,0.8,0.43c0.1,0.03,0.2,0.04,0.29,0.04c0.43,0,0.82-0.28,0.96-0.71C30.82,36.19,30.53,35.63,30,35.46z"
						/>
						<path d="M18.7,25.76c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.1,1.41l2.32,2c0.19,0.16,0.42,0.24,0.65,0.24 c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.1-1.41L18.7,25.76z"/>
						<path d="M34.08,32.21c-0.1,0.06-0.19,0.13-0.28,0.2l-2.18,1.88c-0.42,0.36-0.47,0.99-0.11,1.41c0.2,0.23,0.48,0.35,0.76,0.35 c0.23,0,0.46-0.08,0.65-0.24l2.2-1.89c0.47-0.29,0.62-0.9,0.33-1.38S34.55,31.92,34.08,32.21z"/>
						<path d="M37.86,33.33c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41l2.32,2c0.19,0.16,0.42,0.24,0.65,0.24 c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41L37.86,33.33z"/>
						<path d="M41.1,37.44c-0.36,0.42-0.31,1.05,0.11,1.41l1.14,0.98c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35 c0.36-0.42,0.31-1.05-0.11-1.41l-1.14-0.98C42.1,36.97,41.46,37.02,41.1,37.44z"/>
						<circle cx="30" cy="27" r="2"/>
						<path d="M7.52,12h15.96c0.84,0,1.52-0.67,1.52-1.5S24.32,9,23.48,9H7.52C6.68,9,6,9.67,6,10.5S6.68,12,7.52,12z"/>
						<path d="M7,17h34c0.55,0,1-0.45,1-1s-0.45-1-1-1H7c-0.55,0-1,0.45-1,1S6.45,17,7,17z"/>
					</svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-background-image', {
						paddingTop: 'large',
						paddingBottom: 'large',
						paddingLeft: 'large',
						paddingRight: 'large',
						foregroundColor: '#000',
						contentMaxWidth: '768'
					}, [
						wp.blocks.createBlock('getwid/template-post-title', {
							linkTo: 'post',
							headerTag: 'h3',
							customTextColor: '#fff'
						}),
						wp.blocks.createBlock('getwid/template-post-content', {
							customTextColor: '#fff'
						})
					]),
				]
			},
			{
				'title': __('Two columns', 'getwid'),
				'icon': 		
					<svg version="1.1" width="48" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					viewBox="0 0 48 48" style={{'enable-background':'new 0 0 48 48'}}>
						<path d="M25.99,0H2.01C0.9,0,0,0.9,0,2.01v43.98C0,47.1,0.9,48,2.01,48h23.98C27.1,48,28,47.1,28,45.99V2.01C28,0.9,27.1,0,25.99,0z M25.99,46L2,45.99L2.01,2h23.98V46z"/>
						<path d="M4,29.27c0.23,0,0.46-0.08,0.65-0.24l1.14-0.98c0.42-0.36,0.47-0.99,0.11-1.41c-0.36-0.42-0.99-0.47-1.41-0.11l-1.14,0.98 c-0.42,0.36-0.47,0.99-0.11,1.41C3.44,29.15,3.72,29.27,4,29.27z"/>
						<path d="M14.5,27.9c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-2.46-2.12 c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L14.5,27.9z"/>
						<path d="M7.6,26.17c0.23,0,0.46-0.08,0.65-0.24l2.1-1.81c0.5-0.12,0.82-0.61,0.75-1.12c-0.08-0.55-0.59-0.92-1.14-0.84 c-0.31,0.05-0.59,0.17-0.84,0.38l-2.18,1.88c-0.42,0.36-0.46,0.99-0.1,1.41C7.04,26.05,7.32,26.17,7.6,26.17z"/>
						<path d="M17.12,27.69c-0.42,0.36-0.46,0.99-0.1,1.41c0.2,0.23,0.48,0.35,0.76,0.35c0.23,0,0.46-0.08,0.65-0.24l1.55-1.34 c0.39,0.18,0.87,0.09,1.17-0.25c0.36-0.42,0.32-1.05-0.1-1.41c-0.59-0.52-1.57-0.53-2.2,0L17.12,27.69z"/>
						<path d="M23.35,30.83c0.19,0.16,0.42,0.24,0.65,0.24c0.28,0,0.56-0.12,0.76-0.35c0.36-0.42,0.31-1.05-0.11-1.41l-1.14-0.98 c-0.42-0.36-1.05-0.31-1.41,0.11c-0.36,0.42-0.31,1.05,0.11,1.41L23.35,30.83z"/>
						<circle cx="17" cy="21" r="2"/>
						<path d="M33.52,18h12.96c0.84,0,1.52-0.67,1.52-1.5S47.32,15,46.48,15H33.52C32.68,15,32,15.67,32,16.5S32.68,18,33.52,18z"/>
						<path d="M47,21H33c-0.55,0-1,0.45-1,1s0.45,1,1,1h14c0.55,0,1-0.45,1-1S47.55,21,47,21z"/>
						<path d="M47,26H33c-0.55,0-1,0.45-1,1s0.45,1,1,1h14c0.55,0,1-0.45,1-1S47.55,26,47,26z"/>
						<path d="M42,31h-9c-0.55,0-1,0.45-1,1s0.45,1,1,1h9c0.55,0,1-0.45,1-1S42.55,31,42,31z"/>
					</svg>,
				'layout': [
					wp.blocks.createBlock('core/columns', {
						linkTo: 'post',
						imageSize: 'post-thumbnail',
					},[
						wp.blocks.createBlock('core/column', {},[
							wp.blocks.createBlock('getwid/template-post-featured-image', {
								linkTo: 'post'
							}),
						]),
						wp.blocks.createBlock('core/column', {},[
							wp.blocks.createBlock('getwid/template-post-title', {
								linkTo: 'post',
								headerTag: 'h3',
							}),
							wp.blocks.createBlock('getwid/template-post-content'),
							wp.blocks.createBlock('getwid/template-post-link', {
								buttonText: 'Continue reading'
							})
						]),
					]),
				]
			},
			{
				'title': __('Custom background', 'getwid'),
				'icon': 				
					<svg version="1.1" width="48" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					viewBox="0 0 48 48" style={{'enable-background':'new 0 0 48 48'}}>
						<path d="M34.48,15H13.52C12.68,15,12,15.67,12,16.5s0.68,1.5,1.52,1.5h20.96c0.84,0,1.52-0.67,1.52-1.5S35.32,15,34.48,15z"/>
						<path d="M35,21H13c-0.55,0-1,0.44-1,0.98c0,0.54,0.45,0.98,1,0.98h22c0.55,0,1-0.44,1-0.98C36,21.44,35.55,21,35,21z"/>
						<path d="M35,26H13c-0.55,0-1,0.45-1,1s0.45,1,1,1h22c0.55,0,1-0.45,1-1S35.55,26,35,26z"/>
						<path d="M35,31H13c-0.55,0-1,0.45-1,1s0.45,1,1,1h22c0.55,0,1-0.45,1-1S35.55,31,35,31z"/>
						<path d="M47.84,1.23L47.84,1.23C47.84,1.23,47.84,1.23,47.84,1.23c-0.07-0.16-0.16-0.3-0.27-0.44c0,0,0,0,0,0l0,0 C47.21,0.31,46.64,0,45.99,0H2.41h-0.4C1.89,0,1.78,0.02,1.67,0.03l0,0c-0.83,0.14-1.49,0.8-1.63,1.63l0,0C0.02,1.78,0,1.89,0,2.01 v43.98c0,0.65,0.31,1.22,0.79,1.59l0,0c0,0,0,0,0,0c0.14,0.1,0.28,0.2,0.44,0.27c0,0,0,0,0,0l0,0C1.47,47.94,1.73,48,2.01,48h43.98 C47.1,48,48,47.1,48,45.99V2.01C48,1.73,47.94,1.47,47.84,1.23z M45.99,2v0.37l-6.94,6.94C38.74,9.12,38.38,9,37.99,9h-2.16l7-7 H45.99z M10,36.99L10.01,11h27.98v26L10,36.99z M42.12,2l-7,7h-3.53l7-7H42.12z M37.88,2l-7,7h-3.53l7-7H37.88z M33.64,2l-7,7h-3.53 l7-7H33.64z M29.4,2l-7,7h-3.53l7-7H29.4z M25.16,2l-7,7h-3.55l7-7H25.16z M20.9,2l-7,7h-3.53l7-7H20.9z M2.01,2h1.93L2.01,3.93 L2.01,2z M2.01,4.64L4.65,2h3.53L2.01,8.17L2.01,4.64z M2.01,8.88L8.89,2h3.53L2.01,12.42L2.01,8.88z M2.01,13.12L13.13,2h3.53 L9.62,9.04C9.75,9.01,9.88,9,10.01,9C8.9,9,8,9.9,8,11.01c0-0.13,0.01-0.26,0.04-0.39l-6.03,6.03L2.01,13.12z M2.01,17.36L8,11.37 v3.53L2.01,20.9L2.01,17.36z M2.01,21.61L8,15.61v3.55l-6,6L2.01,21.61z M2,25.86l6-6v3.53l-6,6L2,25.86z M2,30.1l6-6v3.53l-6,6 L2,30.1z M2,34.35l6-6v3.53l-6,6L2,34.35z M2,38.59l6-6v3.53l-6,6L2,38.59z M2,45.99l0-3.16l6-6v0.16c0,0.91,0.62,1.68,1.45,1.92 l-7.08,7.08L2,45.99z M3.08,45.99L10.07,39h3.53l-6.99,6.99L3.08,45.99z M7.32,45.99L14.31,39h3.55l-6.99,6.99L7.32,45.99z M11.57,45.99L18.57,39h3.53l-6.99,6.99L11.57,45.99z M15.81,45.99L22.81,39h3.53l-6.99,6.99L15.81,45.99z M20.05,45.99L27.05,39 h3.53l-6.99,6.99L20.05,45.99z M24.29,46l7-7h3.53l-7,7L24.29,46z M45.99,46l-0.48,0l0.48-0.48V46z M45.99,44.81L44.8,46l-3.55,0 l4.74-4.74V44.81z M45.99,40.55L40.55,46l-3.53,0l8.98-8.98V40.55z M45.99,36.31L36.31,46l-3.53,0l13.22-13.22V36.31z M45.99,32.07 L32.07,46l-3.53,0l7-7h2.46C39.1,39,40,38.1,40,36.99v-2.46l5.99-5.99V32.07z M45.99,27.83L40,33.82v-3.53l5.99-5.99V27.83z M45.99,23.59L40,29.58v-3.53l5.99-5.99V23.59z M45.99,19.35L40,25.34v-3.53l5.99-5.99V19.35z M45.99,15.11L40,21.1v-3.53l5.99-5.99 V15.11z M45.99,10.87L40,16.86v-3.55l5.99-5.99V10.87z M40,12.6v-1.59c0-0.54-0.21-1.02-0.56-1.38l6.55-6.55v3.53L40,12.6z"/>
					</svg>,
				'layout': [
					wp.blocks.createBlock('getwid/section', {
						customBackgroundColor: '#f3f8fb',
						paddingTop: 'large',
						paddingBottom: 'large',
						paddingLeft: 'large',
						paddingRight: 'large',
						verticalAlign: 'flex-start',
						horizontalAlign: 'flex-start'
					}, [
						wp.blocks.createBlock('getwid/template-post-title', {
							linkTo: 'post',
							headerTag: 'h3',
						}),
						wp.blocks.createBlock('getwid/template-post-content'),
						wp.blocks.createBlock('getwid/template-post-link', {
							buttonText: 'Continue reading'
						})
					])
				]
			},
		];

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<div
						className={ classnames(
							className,
						) }
					>

						<div className="components-placeholder block-editor-inner-blocks__template-picker has-many-options">
							<div className="components-placeholder__label">
								<Dashicon icon="layout" />{__('Choose Layout', 'getwid')}
							</div>
							<div className="components-placeholder__instructions">{__('Select a layout to start with, or make one yourself.', 'getwid')}</div>
							<div className="components-placeholder__fieldset">
								<ul className="block-editor-inner-blocks__template-picker-options">
									{
									templates.map((key, index) => {
										return (
											<li>
												<Button
													className="components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"
													key={ index }
													onClick={
														() => {
															dispatch('core/editor').replaceBlocks(clientId, key.layout);
														}
													}
												>
													{ key.icon }
													<span>{ key.title }</span>
												</Button>
											</li>
										);
									})
								}
								</ul>
							</div>
						</div>
					</div>
				</Fragment>
			);
		}
	}
}

export default (Edit);
