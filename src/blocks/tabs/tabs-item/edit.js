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
class TabItem extends Component {

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
		const {
			attributes: {
				align,
			},
			className,
			baseClass,
			getBlock,
			clientId,
			getParentState
		} = this.props;

		const { rootClientId } = this.state;
		const {
			headerTag,
		} = getBlock( rootClientId ).attributes;

		const itemClass = {
			className: classnames( className, {
				},
				align ? `align${align}` : null
			)
		};

		return (
			<Fragment>
				<Inspector { ...{
					...this.props,
				} } key={ 'inspector' }/>
				<div {...itemClass}>
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

	componentDidUpdate(prevProps, prevState) {

	}

	componentDidMount() {
		const { updateParentOptions } = this.props;
		const { getBlock, clientId, getParentState } = this.props;
		const { rootClientId } = this.state;
		const innerBlocks = getBlock( rootClientId ).innerBlocks;
		const $block = $( `#block-${clientId}` );

		const lastTab = getBlock( rootClientId ).innerBlocks[innerBlocks.length -1].clientId == clientId;

		if (lastTab){
			updateParentOptions('init');
		}
	}

	componentWillUnmount() {
		const { updateParentOptions } = this.props;
		updateParentOptions('remove');
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
] )( TabItem );