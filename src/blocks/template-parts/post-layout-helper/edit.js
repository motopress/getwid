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
	ButtonGroup,
	Button,
	Tooltip,
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
				'title': 'Classic',
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><rect y="43" fill="#BBBBBB" width="40" height="6"/><rect y="51" fill="#BBBBBB" width="64" height="3"/><rect y="56" fill="#BBBBBB" width="64" height="3"/><rect y="61" fill="#BBBBBB" width="40" height="3"/></g><path fill="#DDDDDD" d="M0,0v26v13h64v-7V0H0z M50,18l-9,9L20,6L3,23V3h58v26L50,18z"/></svg>,
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
				'title': 'Background Image',
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><rect fill="#F8F8F8" width="64" height="64"/><g><rect x="10" y="38" fill="#BBBBBB" width="44" height="6"/><rect x="10" y="46" fill="#BBBBBB" width="44" height="3"/><rect x="10" y="51" fill="#BBBBBB" width="23" height="3"/></g><path fill="#BBBBBB" d="M10,10v24h27V10H10z M34,28.7l-4.6-4.6L26.5,27l-6.9-6.9L13,26.7V13h21V28.7z"/></svg>,
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
				'title': 'Columns',
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><rect x="45" y="21" fill="#BBBBBB" width="19" height="6"/><rect x="45" y="29" fill="#BBBBBB" width="19" height="3"/><rect x="45" y="34" fill="#BBBBBB" width="19" height="3"/><rect x="45" y="39" fill="#BBBBBB" width="13" height="3"/></g><path fill="#DDDDDD" d="M0,12v40h40V12H0z M37,45.3l-7.4-7.5l-4.8,4.8L13.6,31.5L3,42.1V15h34V45.3z"/></svg>,
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
				'title': 'Custom Background',
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><rect y="43" fill="#BBBBBB" width="40" height="6"/><rect y="51" fill="#BBBBBB" width="64" height="3"/><rect y="56" fill="#BBBBBB" width="64" height="3"/><rect y="61" fill="#BBBBBB" width="40" height="3"/></g><path fill="#DDDDDD" d="M0,0v26v13h64v-7V0H0z M50,18l-9,9L20,6L3,23V3h58v26L50,18z"/></svg>,
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
												<Tooltip text={ key.title }>
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
													</Button>
												</Tooltip>
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