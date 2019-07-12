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

		const templates = [
			{
				'title': __('Classic', 'getwid'),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect y="45" fill="#505050" width="64" height="3"/><rect y="52" fill="#505050" width="64" height="2"/><rect y="57" fill="#505050" width="64" height="2"/><rect y="62" fill="#505050" width="40" height="2"/><path fill="#505050" d="M62,2v36H2V2H62 M64,0H0v40h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="31.4" x2="2.7" y2="30.1"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5513,2.2756" x1="4.4" y1="28.6" x2="19.1" y2="16"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20,15.3 21.5,14 23,15.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.0432,2.0216" x1="24.5" y1="16.6" x2="37.6" y2="27.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.4,28.5 39.9,29.8 41.4,28.5 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.2164,1.6082" x1="42.6" y1="27.4" x2="45.7" y2="24.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.3,24.3 47.8,23 49.3,24.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5793,2.2897" x1="51" y1="25.8" x2="60.6" y2="34"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.5" y1="34.7" x2="63" y2="36"/></svg>,
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
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="10" y="13" fill="#505050" width="44" height="3"/><rect x="10" y="20" fill="#505050" width="30" height="2"/><path fill="#505050" d="M62,2v60H2V2H62 M64,0H0v64h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="50.3" x2="2.6" y2="48.9"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.8051,1.9026" x1="3.9" y1="47.6" x2="19.4" y2="32.1"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20.1,31.4 21.5,30 22.9,31.4 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.401,2.2005" x1="24.5" y1="33" x2="37.7" y2="46.2"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.5,47 39.9,48.4 41.3,47 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.6018,1.8009" x1="42.6" y1="45.7" x2="45.7" y2="42.5"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.4,41.9 47.8,40.5 49.2,41.9 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.5014,1.7507" x1="50.4" y1="43.1" x2="61" y2="53.6"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.6" y1="54.3" x2="63" y2="55.7"/><circle fill="#505050" cx="53" cy="31" r="3"/></svg>,
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
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="45" y="23" fill="#505050" width="19" height="3"/><rect x="45" y="30" fill="#505050" width="19" height="2"/><rect x="45" y="35" fill="#505050" width="19" height="2"/><rect x="45" y="40" fill="#505050" width="13" height="2"/><path fill="#505050" d="M38,14v36H2V14H38 M40,12H0v40h40V12L40,12z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="43.9" x2="2.6" y2="42.5"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.8809,1.9405" x1="4" y1="41.1" x2="11.5" y2="33.6"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="12.2,32.9 13.6,31.5 15,32.9 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.4039,1.702" x1="16.2" y1="34.1" x2="22.8" y2="40.7"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="23.4,41.3 24.9,42.8 26.3,41.3 "/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="28.3,39.3 29.7,37.9 31.1,39.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5806,2.2903" x1="32.7" y1="40.9" x2="36.8" y2="45"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="37.6" y1="45.8" x2="39" y2="47.2"/></svg>,
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
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect x="14" y="18.96" fill="#505050" width="36" height="3"/><rect x="14" y="26.96" fill="#505050" width="36" height="2"/><rect x="14" y="31.96" fill="#505050" width="36" height="2"/><rect x="14" y="36.96" fill="#505050" width="36" height="2"/><rect x="14" y="41.96" fill="#505050" width="26" height="2"/><polygon fill="#505050" points="18,12.11 17.29,11.41 16.24,12.47 15.19,11.41 14.48,12.11 15.54,13.18 14.48,14.26 15.19,14.96 16.24,13.9 17.29,14.96 18,14.26 16.94,13.18 "/><polygon fill="#505050" points="39,12.11 38.29,11.41 37.24,12.47 36.19,11.41 35.48,12.11 36.54,13.18 35.48,14.26 36.19,14.96 37.24,13.9 38.29,14.96 39,14.26 37.94,13.18 "/><polygon fill="#505050" points="60,12.11 59.29,11.41 58.24,12.47 57.19,11.41 56.48,12.11 57.54,13.18 56.48,14.26 57.19,14.96 58.24,13.9 59.29,14.96 60,14.26 58.94,13.18 "/><polygon fill="#505050" points="7.48,6.11 6.77,5.41 5.72,6.47 4.67,5.41 3.96,6.11 5.02,7.18 3.96,8.26 4.67,8.96 5.72,7.9 6.77,8.96 7.48,8.26 6.42,7.18 "/><polygon fill="#505050" points="28.48,6.11 27.77,5.41 26.72,6.47 25.67,5.41 24.96,6.11 26.02,7.18 24.96,8.26 25.67,8.96 26.72,7.9 27.77,8.96 28.48,8.26 27.42,7.18 "/><polygon fill="#505050" points="49.48,6.11 48.77,5.41 47.72,6.47 46.67,5.41 45.96,6.11 47.02,7.18 45.96,8.26 46.67,8.96 47.72,7.9 48.77,8.96 49.48,8.26 48.42,7.18 "/><polygon fill="#505050" points="18,54.11 17.29,53.41 16.24,54.47 15.19,53.41 14.48,54.11 15.54,55.18 14.48,56.26 15.19,56.96 16.24,55.9 17.29,56.96 18,56.26 16.94,55.18 "/><polygon fill="#505050" points="39,54.11 38.29,53.41 37.24,54.47 36.19,53.41 35.48,54.11 36.54,55.18 35.48,56.26 36.19,56.96 37.24,55.9 38.29,56.96 39,56.26 37.94,55.18 "/><polygon fill="#505050" points="60,54.11 59.29,53.41 58.24,54.47 57.19,53.41 56.48,54.11 57.54,55.18 56.48,56.26 57.19,56.96 58.24,55.9 59.29,56.96 60,56.26 58.94,55.18 "/><polygon fill="#505050" points="7.48,48.11 6.77,47.41 5.72,48.47 4.67,47.41 3.96,48.11 5.02,49.18 3.96,50.26 4.67,50.96 5.72,49.9 6.77,50.96 7.48,50.26 6.42,49.18 "/><polygon fill="#505050" points="28.48,48.11 27.77,47.41 26.72,48.47 25.67,47.41 24.96,48.11 26.02,49.18 24.96,50.26 25.67,50.96 26.72,49.9 27.77,50.96 28.48,50.26 27.42,49.18 "/><polygon fill="#505050" points="49.48,48.11 48.77,47.41 47.72,48.47 46.67,47.41 45.96,48.11 47.02,49.18 45.96,50.26 46.67,50.96 47.72,49.9 48.77,50.96 49.48,50.26 48.42,49.18 "/><polygon fill="#505050" points="60,25.66 59.29,24.96 58.24,26.02 57.19,24.96 56.48,25.66 57.54,26.74 56.48,27.81 57.19,28.51 58.24,27.45 59.29,28.51 60,27.81 58.94,26.74 "/><polygon fill="#505050" points="7.48,19.66 6.77,18.96 5.72,20.02 4.67,18.96 3.96,19.66 5.02,20.74 3.96,21.81 4.67,22.51 5.72,21.45 6.77,22.51 7.48,21.81 6.42,20.74 "/><polygon fill="#505050" points="60,39.11 59.29,38.41 58.24,39.47 57.19,38.41 56.48,39.11 57.54,40.18 56.48,41.26 57.19,41.96 58.24,40.9 59.29,41.96 60,41.26 58.94,40.18 "/><polygon fill="#505050" points="7.48,33.11 6.77,32.41 5.72,33.47 4.67,32.41 3.96,33.11 5.02,34.18 3.96,35.26 4.67,35.96 5.72,34.9 6.77,35.96 7.48,35.26 6.42,34.18 "/><path fill="#505050" d="M62,2v60H2V2H62 M64,0H0v64h64V0L64,0z"/></svg>,
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
													className="components-button components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"												
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