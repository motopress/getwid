/**
 * External dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss';

/**
 * WordPress dependencies
 */
const { serverSideRender: ServerSideRender } = wp;

const {
	Component,
	Fragment,
} = wp.element;
const {
	Disabled,
	Dashicon
} = wp.components;
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.blockEditor || wp.editor;
const {
	select,
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

			className,
			setAttributes,
		} = this.props;

		const current_post_type = select( "core/editor" ).getCurrentPostType(),
			  wrapperclass 	    = classnames(
			  	  className,
				  align ? `align${ align }` : null,
			  );

		if ( current_post_type && current_post_type == Getwid.templates.name ) {
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							controls= { [ 'left', 'center', 'right' ] }
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>
					</BlockControls>
					<div className={wrapperclass}>
						<div className="components-placeholder editor-media-placeholder">
							<div className="components-placeholder__label">
								<Dashicon icon="format-image" />
							</div>
							<div className="components-placeholder__instructions">{__('Image ACF', 'getwid')}</div>
						</div>
					</div>

				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-image-acf"
							attributes={ this.props.attributes }
						/>
					</Disabled>
				</Fragment>
			);
		}
	}
}

export default ( Edit );
