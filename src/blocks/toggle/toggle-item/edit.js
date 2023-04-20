/**
* External dependencies
*/
import { __ } from 'wp.i18n';

import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class ToggleItem extends Component {

	constructor() {
		super(...arguments);

		this.state = {
			rootClientId: this.setRootId()
		}
	}

	setRootId() {
		const { clientId, getBlockRootClientId } = this.props;
		return getBlockRootClientId( clientId );
	}

	render() {
		const { className, baseClass, getBlock } = this.props;

		const { rootClientId } = this.state;
		const {
			headerTag,
			iconOpen,
			iconClose
		} = getBlock( rootClientId ).attributes;

		const itemClass = {
			className: classnames( 'wp-block-getwid-toggle__row', {
					'is-active': this.props.attributes.active,
				}
			)
		};

		const Tag = headerTag;

		return (
			<Fragment>
				<Inspector { ...this.props } />
				<div {...itemClass}>
					<div className={`wp-block-getwid-toggle__header-wrapper`}>
						<Tag className={`wp-block-getwid-toggle__header`}>
							<a href="#">
								<div className={`wp-block-getwid-toggle__edit-area`}>
								<RichText
									tagName={'span'}
									className={`wp-block-getwid-toggle__header-title`}
									placeholder={ __( 'Write heading…', 'getwid' ) }
									value={this.props.attributes.title}
									allowedFormats={allowedFormats}
									onChange= {title =>
										this.props.setAttributes({ title })
									}
								/>
								</div>
								<span className={`wp-block-getwid-toggle__icon is-active`}><i className={iconClose}></i></span>
								<span className={`wp-block-getwid-toggle__icon is-passive`}><i className={iconOpen}></i></span>
							</a>
						</Tag>
					</div>

					<div className={`wp-block-getwid-toggle__content-wrapper`}>
						<div className={`wp-block-getwid-toggle__content`}>
							<InnerBlocks
								templateLock={false}
								templateInsertUpdatesSelection={false}
								template={[
									[ 'core/paragraph', { placeholder: __( 'Write text…', 'getwid' ) } ]
								]}
							/>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidMount() {
		const { updateParentOptions } = this.props;
		const { getBlock } = this.props;
		const { rootClientId } = this.state;
		const { clientId } = this.props;
		const $block = $( `#block-${clientId}` );
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getEditorSettings, getBlockRootClientId } = select( 'core/block-editor' );
		return {
			getBlock,
			getEditorSettings,
			getBlockRootClientId,
		};
	} )
] )( ToggleItem );
