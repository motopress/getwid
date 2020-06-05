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
* Create an Component
*/
class AccordionItem extends Component {

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
			align,
			headerTag,
			iconOpen,
			iconClose
		} = getBlock( rootClientId ).attributes;

		const itemClass = {
			className: classnames( className, {
				},
				align ? `align${align}` : null
			)
		};

		const Tag = headerTag;

		return (
			<Fragment>
				<Inspector { ...{
					...this.props,
				} } key={ 'inspector' }/>
				<div {...itemClass}>
					<div className={`${baseClass}__header-wrapper`} key='header'>
						<Tag className={`${baseClass}__header`}>
							<a href="#">
								<div className={`${baseClass}__edit-area`}>
								<RichText
									tagName={'span'}
									className={`${baseClass}__header-title`}
									placeholder={ __( 'Write title…', 'getwid' ) }
									value={this.props.attributes.title}
									formattingControls= {[ 'bold', 'italic', 'strikethrough' ]}
									onChange= {title =>
										this.props.setAttributes({ title })
									}
									keepPlaceholderOnFocus
								/>
								</div>
								<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
								<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
							</a>
						</Tag>
					</div>

					<div className={`${baseClass}__content`}>
						<InnerBlocks
							templateLock={false}
							templateInsertUpdatesSelection={false}
							template={[
								[ 'core/paragraph', { placeholder: __( 'Write text…', 'getwid' ) } ]
							]}
						/>
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
		const { getBlock, getEditorSettings, getBlockRootClientId } = select( 'core/editor' );
		return {
			getBlock,
			getEditorSettings,
			getBlockRootClientId,
		};
	} )
] )( AccordionItem );