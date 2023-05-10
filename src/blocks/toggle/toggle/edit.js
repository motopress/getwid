/**
* External dependencies
*/
import { __ , sprintf } from 'wp.i18n';
import { times, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import classnames from "classnames";
import './editor.scss';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { InnerBlocks } = wp.blockEditor || wp.editor;
const { Component, Fragment, createContext } = wp.element;
const { TextControl, Button } = wp.components;
const { createBlock } = wp.blocks;
const { jQuery: $ } = window;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/toggle-item' ];

const { Consumer, Provider } = createContext();

/**
* Create an Component
*/
class Toggle extends Component {

	constructor() {
		super(...arguments);

		this.renderConstructorForm = this.renderConstructorForm.bind( this );
		this.onConstructToggle = this.onConstructToggle.bind( this );
		this.changeState = this.changeState.bind( this );
		this.getState = this.getState.bind( this );
		this.addItem = this.addItem.bind( this );

		this.state = {
			initToggle: false,
			initialToggleCount: 3
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getState(value) {
		return this.state[value];
	}

	onConstructToggle(event) {
		event.preventDefault();

		this.changeState({
			initToggle: true
		});
	}

	renderConstructorForm() {
		const { initialToggleCount } = this.state;

		return (
			<form onSubmit={this.onConstructToggle}>
				<TextControl
					type='number'
					label={__( 'Number of items', 'getwid' )}
					onChange={initialToggleCount => this.changeState({ initialToggleCount })}
					value={initialToggleCount}
					min='1'
				/>
				<Button isPrimary type='submit'>
					{__( 'Create', 'getwid' )}
				</Button>
			</form>
		);
	}

	render() {
		const { changeState, getState } = this;

		const {
			attributes: {
				iconPosition,
			},
			className,
			baseClass,
			getBlock,
			clientId,
			isSelected
		} = this.props;

		//Check innerBlocks
		const { initialToggleCount, initToggle } = this.state;
		let innerBlocks;
		const block = getBlock( clientId );
		innerBlocks = block.innerBlocks;
		if ( !innerBlocks.length && initToggle == false ) {
			return this.renderConstructorForm();
		}

		return (
			<Fragment>
				<Inspector
					{ ...{
						...this.props,
						changeState,
						getState
					} }
				/>
				<div
					className={classnames(className, {
						'has-icon-left': iconPosition === 'left'
					})}
				>
					<Provider value={this}>
						<InnerBlocks
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							//translators: %d is a counter 1, 2, 3
							template={times( initialToggleCount, index => [ 'getwid/toggle-item', { title: sprintf( __( 'Element #%d', 'getwid' ), ++index ) } ] )}
							templateLock={false}
							renderAppender={() => {
								return isSelected ? (
									<div className={`${baseClass}__add-toggle`}>
										<Button
											icon='insert'
											onClick={this.addItem}
											label={__( 'Add Toggle', 'getwid' )}
										/>
									</div>
								) : '';
							}}
						/>
					</Provider>
				</div>
			</Fragment>
		);
	}

	addItem() {
		const { insertBlock, getBlock, clientId } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );

		if ( block ) {
			innerBlocks = block.innerBlocks;
			//translators: %d is a counter 1, 2, 3
			const insertedBlock = createBlock( 'getwid/toggle-item', { title: sprintf( __( 'Element #%d', 'getwid' ), innerBlocks.length + 1 ) } );
			insertBlock( insertedBlock, innerBlocks.length, clientId );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { clientId } = this.props;
		const { getBlock, updateBlockAttributes } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );
		if ( block ) {
			innerBlocks = block.innerBlocks;
		}

		const $block = $( `#block-${clientId}` );

		/* #region update inner blocks attributes */
		const {
			attributes: {
				iconPosition,
				iconOpen,
				iconClose,
				headerTag
			}
		} = this.props;

		if ( !isEqual( prevProps.attributes, this.props.attributes)) {

			if ( innerBlocks ) {
				if ( innerBlocks.length ) {
					$.each( innerBlocks, (index, item) => {
						updateBlockAttributes( item.clientId, {
							outerParent: {
								attributes: {
									iconPosition,
									iconOpen,
									iconClose,
									headerTag
								}
							}
						} );
					} );
				}
			}
		}
	}

}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getEditorSettings } = select( 'core/block-editor' );
		return {
			getEditorSettings,
			getBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes, insertBlock } = dispatch( 'core/block-editor' );
		return {
			insertBlock,
			updateBlockAttributes
		};
	} ),
] )( Toggle );

export { Consumer };
