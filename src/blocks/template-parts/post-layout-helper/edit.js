/**
* External dependencies
*/
import Inspector from './inspector';
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
				'title': 'Image + Title + Content',
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-image', {
						linkTo: 'post',
						imageSize: 'post-thumbnail',
					}),
					wp.blocks.createBlock('getwid/template-post-title', {
						linkTo: 'post',
						headerTag: 'h4',
					}),
					wp.blocks.createBlock('getwid/template-post-content', {
						contentLength: '25',
					})
				]
			},
			{
				'title': 'Title + Meta + Content',
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-title', {
						linkTo: 'post',
						headerTag: 'h4',
					}),
					wp.blocks.createBlock('getwid/template-post-meta'),		
					wp.blocks.createBlock('getwid/template-post-content', {
						contentLength: '25',
					})
				]
			},	
			{
				'title': 'Section Inner content',
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-background-image', {
						minHeight: '400px',
					} ,[
						wp.blocks.createBlock('getwid/section', {
							minHeight: '400px',
						}, [
							wp.blocks.createBlock('getwid/template-post-title', {
								linkTo: 'post',
								headerTag: 'h4',
							}),							
						]),
					]),
				]
			},
		];

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>	
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










{/* 
						<ButtonGroup aria-label={ __( 'Layout', 'getwid' ) }>
							{
								layout_options.map((key, index) => {
									return (
										<li>
											<Tooltip text={ key.name }>
												<Button												
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
						</ButtonGroup> */}





					</div>
				</Fragment>
			);			
		}
	}
}

export default (Edit);