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
	ServerSideRender,
	Disabled,
	withFallbackStyles,
	ButtonGroup,
	Button,
	Tooltip,
} = wp.components;
import { __ } from 'wp.i18n';
const {
	AlignmentToolbar,
	BlockControls,
	withColors,
	withFontSizes,
} = wp.editor;
const {
	select,
	dispatch
} = wp.data;
const { compose } = wp.compose;
const { createBlock } = wp.blocks;



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
				textAlignment,
			},

			setAttributes,
			className,
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();
		const clientId = select('core/editor').getSelectedBlockClientId();

		const layout_options = [
			{
				'name': 'Image + Title + Content',
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
				'name': 'Title + Meta + Content',
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
		];

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<BlockControls>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>			
					</BlockControls>
	
					<div
						className={ classnames(
							className,
						) }
					>
						<ButtonGroup aria-label={ __( 'Layout', 'getwid' ) }>
							{
								layout_options.map((key, index) => {
									return (
										<Fragment>
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
										</Fragment>																
									);
								})
							}
						</ButtonGroup>
					</div>
				</Fragment>
			);			
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }, 'iconColor'),
	withFontSizes( 'fontSize' ),
])(Edit);