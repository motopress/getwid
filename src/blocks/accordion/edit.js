/**
* External dependencies
*/
import classnames from 'classnames';
import ItemsAttributeManager from 'GetwidUtils/items-attribute-utils';
import Inspector from './inspector';
import { isEqual } from "lodash";
import './editor.scss'


/**
* WordPress dependencies
*/
const {__} = wp.i18n;
const {Component} = wp.element;
const {
	RichText,
	BlockControls
} = wp.editor;
const {
	TextControl,
	Button,
	Toolbar,
	DropdownMenu,
	IconButton
} = wp.components;
const { Fragment } = wp.element;
const {jQuery: $} = window;


/**
* Create an Component
*/
export default class Edit extends Component {

	constructor() {
		super(...arguments);
		const {
			attributes: {
				items, active
			}
		} = this.props;

		this.onConstructAcc = this.onConstructAcc.bind(this);
		this.onDeleteItem = this.onDeleteItem.bind(this);
		this.onAccActivate = this.onAccActivate.bind(this);

		this.moveAcc = this.moveAcc.bind(this);
		this.onMoveAccTop = this.onMoveAccTop.bind(this);
		this.onMoveAccBottom = this.onMoveAccBottom.bind(this);

		this.onDuplicate = this.onDuplicate.bind(this);

		this.insertAcc = this.insertAcc.bind(this);
		this.onInsertAccBefore = this.onInsertAccBefore.bind(this);
		this.onInsertAccAfter = this.onInsertAccAfter.bind(this);

		this.activateAcc = this.activateAcc.bind(this);

		this.onAddAcc = this.onAddAcc.bind(this);
		this.initAcc = this.initAcc.bind(this);

		/**
		 * @type {ItemsAttributeManager}
		 */
		this.itemsManager = new ItemsAttributeManager({
			items: {
				isWrapper: true,
				attributes: {
					content: {
						alias: 'content',
						// default: ''
						default: n => `Content ${n+1}`
					},
				}
			},
			titles: {
				isWrapper: true,
				attributes: {
					content: {
						alias: 'title',
						// default: ''
						default: n => `Element #${n+1}`
					},
				}
			}
		});

		this.state = {
			selectedAcc: active !== undefined ? active : (items.length ? 0 : null),
			initialAccCount: 3
		};
	}

	/**
	 * Render accordion constructor form
	 *
	 */
	renderConstructorForm() {
		const {initialAccCount} = this.state;

		return (
			<form onSubmit={this.onConstructAcc}>
				<TextControl
					type="number"
					label={__('Number of items', 'getwid')}
					onChange={initialAccCount => this.setState({initialAccCount})}
					value={initialAccCount}
					min="1"
				/>
				<Button isPrimary type="submit">
					{__('Create', 'getwid')}
				</Button>
			</form>
		);
	}

	/**
	 * Retrieve toolbar dropdown accordion controls
	 *
	 * @return {*[]}
	 */
	getAccordionDropdown() {

		const {selectedAcc} = this.state;

		const {
			attributes: {
				items
			}
		} = this.props;

		return [
			{
				icon: 'table-row-before',
				title: __('Add Item Before', 'getwid'),
				isDisabled: selectedAcc === null,
				onClick: this.onInsertAccBefore,
			},
			{
				icon: 'table-row-after',
				title: __('Add Item After', 'getwid'),
				isDisabled: selectedAcc === null,
				onClick: this.onInsertAccAfter,
			},
			{
				icon: 'arrow-up-alt2',
				title: __('Move Item Up', 'getwid'),
				isDisabled: selectedAcc === null || selectedAcc === 0,
				onClick: this.onMoveAccTop,
			},
			{
				icon: 'arrow-down-alt2',
				title: __('Move Item Down', 'getwid'),
				isDisabled: selectedAcc === null || selectedAcc === items.length - 1,
				onClick: this.onMoveAccBottom,
			},
			{
				icon: 'admin-page',
				title: __('Duplicate Item', 'getwid'),
				isDisabled: selectedAcc === null,
				onClick: this.onDuplicate,
			},
			{
				icon: 'trash',
				title: __('Delete Item', 'getwid'),
				isDisabled: selectedAcc === null,
				onClick: this.onDeleteItem,
			},
		];
	}

	render() {

		const {
			attributes: {
				items,
				titles,
				iconPosition,
				iconOpen,
				iconClose,
				active,
				headerTag
			},
			className,
			isSelected
		} = this.props;

		if (!items.length) {
			return this.renderConstructorForm();
		}

		const Tag = headerTag;

		return (
			[
				<BlockControls key={'toolbar'}>
					<Toolbar>
						{/*{`Selected Item: ${this.state.selectedAcc}`}*/}
						<DropdownMenu
							icon="edit"
							label={__('Edit Accordion', 'getwid')}
							controls={this.getAccordionDropdown()}
						/>
					</Toolbar>
				</BlockControls>,

				<Inspector {...this.props} key={'inspector'}/>,

				<div className={classnames(className, {
						'has-icon-left': iconPosition === 'left'
					})}
					data-active-element={active}
					key={'edit'}
				>

					{titles.map((item, index) => (
						<Fragment>
							<div className="wp-block-getwid-accordion__header-wrapper" key={'header'}>

								<Tag className='wp-block-getwid-accordion__header'>
									<a href="#">
										<div className="wp-block-getwid-accordion__edit-area">									
											<RichText
												tagName='span'
												className='wp-block-getwid-accordion__header-title'
												placeholder={__('Title', 'getwid')}
												value={item.content}
												onChange={(value) => this.onChange({
													alias: 'title',
													index,
													value
												})}
												formattingControls={['bold', 'italic', 'strikethrough']}
												onSplit={() => null}
												multiline={false}
											/>
										</div>

										<span className="wp-block-getwid-accordion__icon is-active"><i className={iconClose}></i></span>
										<span className="wp-block-getwid-accordion__icon is-passive"><i className={iconOpen}></i></span>
									</a>
								</Tag>

							</div>
							<div className="wp-block-getwid-accordion__content" key={'content'}>
								<RichText
									tag={'p'}
									placeholder={__('Write text…', 'getwid')}
									value={items[index].content}
									onChange={(value) => this.onChange({
										alias: 'content',
										index,
										value
									})}
								/>
							</div>
						</Fragment>	
					))}

					{isSelected && (
						<Fragment>	
							<div className="wp-block-getwid-accordion__add-accordion">
								<IconButton
									icon="insert"
									onClick={this.onAddAcc}
									label={__('Add Item', 'getwid')}
								/>
							</div>
						</Fragment>	
					)}

				</div>
			]
		);
	}

	/**
	 *
	 * @param {boolean} refresh
	 */
	initAcc(refresh = false) {

		const {
			attributes: {
				active,
			}
		} = this.props;

		const accEl = $(ReactDOM.findDOMNode(this));

		if (refresh) {
			accEl.accordion('refresh');
		} else {

			setTimeout(()=>{
				accEl.accordion({
					header: '.wp-block-getwid-accordion__header-wrapper',
					icons: false,
					active: active !== undefined ? parseInt(active, 10) : 0,
					activate: this.onAccActivate,
					heightStyle: 'content'
				});
			}, 0)
		}

		//Remove all key events from accordion
		$('.wp-block-getwid-accordion__header-wrapper', accEl).off('keydown');
		// $.ui.accordion.prototype._keydown = function (){};
		// accEl.find('.wp-block-getwid-accordion__header-wrapper').off('keydown');
	}

	componentDidMount() {
		this.initAcc();
	}

	componentDidUpdate(prevProps, prevState) {
		const {
			attributes: {
				items: prevItems,
				titles: prevTitles
			}
		} = prevProps;

		// Refresh accordion only if attributes changes
		if (!isEqual(this.props.attributes, prevProps.attributes)) {
			this.initAcc(!!prevItems.length);
		}

	}

	/**
	 *
	 * @param {number} index
	 */
	activateAcc(index) {
		$(ReactDOM.findDOMNode(this)).accordion('option', 'active', index);
	}

	/**
	 *
	 * @param {Event} event
	 * @param {{newHeader: jQuery, newPanel: jQuery, oldHeader: jQuery, oldPanel: jQuery}} ui
	 */
	onAccActivate(event, ui) {
		const selectedAcc = ui.newHeader.length ? ui.newHeader.parent().children('.wp-block-getwid-accordion__header-wrapper').index(ui.newHeader) : null;
		
		// Synchronize state with active accordion
		this.setState({
			selectedAcc
		});
	}

	/**
	 *
	 * @param {Event} event
	 */
	onConstructAcc(event) {

		event.preventDefault();

		const {setAttributes} = this.props;
		let {initialAccCount} = this.state;

		const itemsCount = parseInt(initialAccCount, 10) || 3;

		setAttributes(this.itemsManager.createItems({itemsCount}));

		this.setState({
			selectedAcc: 0
		});
	}

	onDeleteItem() {
		const {selectedAcc} = this.state;

		if (selectedAcc === null) {
			return;
		}

		const {
			attributes: {
				items,
				active
			}
		} = this.props;

		const {attributes, setAttributes} = this.props;

		const changed = this.itemsManager.deleteItem(attributes, {index: selectedAcc});

		// Reset active attribute if it greater than items count
		if (active >= items.length - 1) {
			changed['active'] = undefined;
		}

		setAttributes(changed);

		// If removing last item then reset selectedAcc
		if (items.length === 1) {
			this.setState({selectedAcc: null});
		}
	}

	/**
	 * On plus button click - append row
	 */
	onAddAcc() {
		const {
			attributes: {
				items
			},
		} = this.props;

		this.insertAcc({
			index: items.length
		});

	}

	/**
	 * Inserts a row before the currently selected accordion.
	 */
	onInsertAccBefore() {
		const {selectedAcc} = this.state;

		if (selectedAcc === null) {
			return;
		}

		this.insertAcc({
			index: selectedAcc
		});
	}

	/**
	 * Inserts a row after the currently selected accordion.
	 */
	onInsertAccAfter() {
		const {selectedAcc} = this.state;

		if (selectedAcc === null) {
			return;
		}

		this.insertAcc({
			index: selectedAcc + 1
		});
	}

	onDuplicate() {
		const {selectedAcc} = this.state;
		const {attributes, setAttributes} = this.props;

		if (selectedAcc === null) {
			return;
		}

		setAttributes(this.itemsManager.duplicateItem(attributes, {
			index: selectedAcc
		}));

		this.activateAcc(selectedAcc + 1);
	}

	/**
	 *
	 * @param {number} options.index
	 * @param {Object} [options.item] Item pseudo-state to insert
	 */
	insertAcc({
		index,
		item
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.insertItem(attributes, {
			index: index,
			item
		}));

		this.activateAcc(index);
	}

	onMoveAccTop() {
		const {selectedAcc} = this.state;

		if (selectedAcc === null) {
			return;
		}

		this.moveAcc({
			from: selectedAcc,
			to: selectedAcc - 1
		})
	}

	onMoveAccBottom() {
		const {selectedAcc} = this.state;

		if (selectedAcc === null) {
			return;
		}

		this.moveAcc({
			from: selectedAcc,
			to: selectedAcc + 1
		})
	}

	/**
	 *
	 * @param {number} options.from
	 * @param {number} options.to
	 */
	moveAcc({
		from,
		to
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.moveItem(attributes, {
			index: from,
			toIndex: to
		}));

		this.activateAcc(to);
	}

	/**
	 *
	 * @param {string} options.alias
	 * @param {mixed} options.value
	 * @param {number} options.index
	 */
	onChange({
		alias,
		value,
		index
	}) {
		const {attributes, setAttributes} = this.props;
		setAttributes(this.itemsManager.updateItem(attributes, {
			itemState: {
				[alias]: value
			},
			index
		}));
	}
}