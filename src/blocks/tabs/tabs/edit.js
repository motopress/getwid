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
const { InnerBlocks, RichText, BlockControls } = wp.blockEditor || wp.editor;
const { Component, Fragment, createContext } = wp.element;
const { IconButton, TextControl, Button, Toolbar } = wp.components;
const { createBlock, cloneBlock } = wp.blocks;
const { jQuery: $ } = window;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/tabs-item' ];

const { Consumer, Provider } = createContext();

/**
* Create an Component
*/
class Tabs extends Component {

	constructor() {
		super(...arguments);

		const { active } = this.props.attributes;

		this.updateParentOptions = this.updateParentOptions.bind( this );
		this.renderConstructorForm = this.renderConstructorForm.bind( this );
		this.onConstructAcc = this.onConstructAcc.bind( this );
		this.changeState = this.changeState.bind( this );
		this.getState = this.getState.bind( this );

		this.addTab = this.addTab.bind( this );
		this.moveTabLeft = this.moveTabLeft.bind( this );
		this.moveTabRight = this.moveTabRight.bind( this );
		this.duplicateTab = this.duplicateTab.bind( this );
		this.deleteTab = this.deleteTab.bind( this );

		this.state = {
			selectedTab: (active !== undefined) ? parseInt( active ) : 0,
			initTabs: false,
			initNavs: false,
			updateNavs: false,
			initialTabsCount: 3
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

	onConstructAcc(event) {
		event.preventDefault();

		this.changeState({
			initTabs: true
		});
	}

	renderConstructorForm() {
		const { initialTabsCount } = this.state;

		return (
			<form onSubmit={this.onConstructAcc}>
				<TextControl
					type='number'
					label={__( 'Number of items', 'getwid' )}
					onChange={initialTabsCount => this.changeState({ initialTabsCount })}
					value={initialTabsCount}
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
				align,
				active,
				type,
				headerTag,
			},
			className,
			baseClass,
			getBlock,
			clientId,
			isSelected,
			updateBlockAttributes
		} = this.props;

		//Check innerBlocks
		const {
			selectedTab,
			initialTabsCount,
			initTabs
		} = this.state;

		let innerBlocks;
		const block = getBlock( clientId );
		innerBlocks = block.innerBlocks;

		if ( !innerBlocks.length && initTabs == false ) {
			return this.renderConstructorForm();
		}

		const Tag = headerTag;

		return (
			<Fragment>
				<BlockControls key='toolbar'>
					<Toolbar controls={this.getTabsDropdown()}/>
				</BlockControls>
				<Inspector { ...{
					...this.props,
					...{ changeState },
					...{ getState }
				} } key={ 'inspector' } />
				<div
					className={classnames(className,
						`${baseClass}--current-tab-${selectedTab + 1}`,
						{
							[`has-layout-${type}`]: type !== '',
						},
						align ? `align${align}` : null
					)}
					data-active-tab={active != undefined ? active : '0'}
				>
					<ul className={`${baseClass}__nav-links`}>
						{innerBlocks.map((item, index) => {
							return (
								<Fragment>
									<li
										className={classnames(`${baseClass}__nav-link`, {
											'active-tab': selectedTab == index,
										})}
										onClick={(e) => {
											this.selectTab(index);
										}}
									>
										<Tag className={`${baseClass}__title-wrapper`}>
											<a href="#">
												<div className={`${baseClass}__edit-area`}>
													<RichText
														tagName={'span'}
														className={`${baseClass}__title`}
														placeholder={ __( 'Write heading…', 'getwid' ) }
														value={item.attributes.title}
														formattingControls= {[ 'bold', 'italic', 'strikethrough' ]}
														onChange= {val => {
															updateBlockAttributes( item.clientId, {
																title: val
															} );
														}}
														keepPlaceholderOnFocus
													/>
												</div>
											</a>
										</Tag>
									</li>
								</Fragment>
							)
						})}
						{ isSelected && (
							<div className={`${baseClass}__add-tab`}>
								<IconButton
									icon='insert'
									onClick={(e) => {
										this.addTab(innerBlocks.length);
									}}
									label={__( 'Add Tab', 'getwid' )}
								/>
							</div>
						)}
					</ul>

					<div className={`${baseClass}__tabs-wrapper-editor`}>
						<div className={`${baseClass}__tab-content`}>
							<Provider value={this}>
								<InnerBlocks
									__experimentalUIParts={{
										hasSelectedUI: false,
										hasMovers: false,
									}}
									templateInsertUpdatesSelection={false}
									allowedBlocks={ALLOWED_BLOCKS}
									template={times( initialTabsCount, index => [ 'getwid/tabs-item', { title: sprintf( __( 'Element #%d', 'getwid' ), ++index ) } ] )}
									templateLock={false}
									renderAppender={() => {
										return '';
									}}
								/>
							</Provider>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	getTabsDropdown() {
		const { selectedTab } = this.state;
		const { getBlock, clientId } = this.props;

		const block = getBlock( clientId );
		const innerBlocks = block.innerBlocks;

		return [{
				icon: 'table-col-before',
				title: __( 'Add Item Before', 'getwid' ),
				isDisabled: selectedTab === null,
				onClick: ()=>{
					this.addTab((selectedTab == 0 ? 0 : selectedTab - 1));
				}
			}, {
				icon: 'table-col-after',
				title: __( 'Add Item After', 'getwid' ),
				isDisabled: selectedTab === null,
				onClick: ()=>{
					this.addTab(selectedTab + 1);
				}
			}, {
				icon: 'arrow-left-alt2',
				title: __( 'Move Item Left', 'getwid' ),
				isDisabled: selectedTab === null || selectedTab === 0,
				onClick: this.moveTabLeft
			}, {
				icon: 'arrow-right-alt2',
				title: __( 'Move Item Right', 'getwid' ),
				isDisabled: selectedTab === null || selectedTab === innerBlocks.length - 1,
				onClick: this.moveTabRight
			}, {
				icon: 'admin-page',
				title: __( 'Duplicate Item', 'getwid' ),
				isDisabled: selectedTab === null,
				onClick: this.duplicateTab
			}, {
				icon: 'trash',
				title: __( 'Delete Item', 'getwid' ),
				isDisabled: selectedTab === null || innerBlocks.length == 1,
				onClick: this.deleteTab
			}
		];
	}

	moveTabLeft() {
		const { selectedTab } = this.state;
		const {moveBlockToPosition, getBlock, clientId } = this.props;
		const block = getBlock( clientId );
		const innerBlocks = block.innerBlocks;

		moveBlockToPosition(
			innerBlocks[selectedTab].clientId,
			clientId,
			clientId,
			selectedTab - 1
		);

		this.selectTab(selectedTab -1);
	}

	moveTabRight() {
		const { selectedTab } = this.state;
		const {moveBlockToPosition, getBlock, clientId } = this.props;
		const block = getBlock( clientId );
		const innerBlocks = block.innerBlocks;

		moveBlockToPosition(
			innerBlocks[selectedTab].clientId,
			clientId,
			clientId,
			selectedTab + 1
		);

		this.selectTab(selectedTab + 1);
	}

	duplicateTab() {
		const { selectedTab } = this.state;
		const { insertBlock, getBlock, clientId } = this.props;
		const block = getBlock( clientId );

		if (block){
			const innerBlocks = block.innerBlocks;
			if (innerBlocks.length && typeof innerBlocks[selectedTab] != 'undefined'){
				const newBlock = cloneBlock( getBlock( innerBlocks[selectedTab].clientId ) );
				newBlock.attributes.title = `${newBlock.attributes.title} ${__( 'Copy', 'getwid' )}`;
				insertBlock( newBlock, selectedTab + 1, clientId );
			}
		}
	}

	deleteTab() {
		const { selectedTab } = this.state;
		const { removeBlocks, getBlock, clientId } = this.props;
		const block = getBlock( clientId );

		if (block){
			const innerBlocks = block.innerBlocks;
			if (innerBlocks.length && typeof innerBlocks[selectedTab] != 'undefined'){
				removeBlocks(innerBlocks[selectedTab].clientId);
				this.selectTab(0);
			}
		}
	}

	selectTab(index) {
		this.setState({
			selectedTab: index
		});
	}

	addTab(index) {
		const { insertBlock, selectBlock, getBlock, clientId } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );

		if ( block ) {
			innerBlocks = block.innerBlocks;
			const insertedBlock = createBlock( 'getwid/tabs-item', { title: sprintf( __( 'Element #%d', 'getwid' ), innerBlocks.length + 1 ) } );
			insertBlock( insertedBlock, index, clientId );
			this.selectTab(index);
			selectBlock( clientId );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { selectedTab, initNavs } = this.state;
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
				headerTag,
			}
		} = this.props;

		if ( !isEqual( prevProps.attributes, this.props.attributes)) {

			if ( innerBlocks ) {
				if ( innerBlocks.length ) {
					$.each( innerBlocks, (index, item) => {
						updateBlockAttributes( item.clientId, {
							outerParent: {
								attributes: {
									headerTag
								}
							}
						} );
					} );
				}
			}
		}
	}

	updateParentOptions(action) {
		const { updateNavs } = this.state;
		if (action == 'init'){
			this.changeState({
				initNavs: true
			});
		} else if (action == 'update'){
			this.changeState({
				updateNavs: !updateNavs
			});
		}
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getEditorSettings } = select( 'core/editor' );
		return {
			getEditorSettings,
			getBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes, insertBlock, moveBlockToPosition, removeBlocks, selectBlock } = dispatch( 'core/editor' );
		return {
			insertBlock,
			moveBlockToPosition,
			removeBlocks,
			updateBlockAttributes,
			selectBlock
		};
	} ),
] )( Tabs );

export { Consumer };