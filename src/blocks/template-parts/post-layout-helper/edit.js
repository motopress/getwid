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
				'title': 'Classic',
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-image', {
						linkTo: 'post'
					}),
					wp.blocks.createBlock('getwid/template-post-title', {
						linkTo: 'post',
						headerTag: 'h3',
					}),
					wp.blocks.createBlock('getwid/template-post-meta'),
					wp.blocks.createBlock('getwid/template-post-content')
				]
			},
			{
				'title': 'Background Image',
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/template-post-featured-background-image', {
						paddingTop: 'large',
						paddingBottom: 'large',
						paddingLeft: 'normal',
						paddingRight: 'normal',
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
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('core/columns', {
						linkTo: 'post',
						imageSize: 'post-thumbnail',
					},[
						wp.blocks.createBlock('core/column', {},[
							wp.blocks.createBlock('getwid/template-post-featured-image')
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
				'icon': <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><rect x="0.000" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="12.400" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="24.800" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="37.200" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /><rect x="49.600" y="0.000" width="10.400" height="30.000" fill="#d5dadf" /></svg>,
				'layout': [
					wp.blocks.createBlock('getwid/section', {
						customBackgroundColor: '#f3f8fb',
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
					</div>
				</Fragment>
			);			
		}
	}
}

export default (Edit);