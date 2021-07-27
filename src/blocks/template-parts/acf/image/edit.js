/**
 * External dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;
const {
	Dashicon
} = wp.components;
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.blockEditor || wp.editor;

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

		const wrapperclass 	    = classnames(
			  	  className,
				  align ? `align${ align }` : null,
			  );

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
						<div className="components-placeholder__instructions">{__('ACF Image', 'getwid')}</div>
					</div>
				</div>

			</Fragment>
		);

	}
}

export default ( Edit );
