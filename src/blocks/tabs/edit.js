import classnames from 'classnames';
import ItemsAttributeManager from 'GetwidUtils/items-attribute-utils';
import Inspector from './inspector';

/**
 * Internal block libraries
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
	Tooltip,
	Dashicon
} = wp.components;

const {jQuery: $} = window;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Edit extends Component {

	constructor() {
		super(...arguments);
		const {
			attributes: {
				items, active
			}
		} = this.props;

		this.onConstructTabs = this.onConstructTabs.bind(this);
		this.onDeleteTab = this.onDeleteTab.bind(this);
		this.onTabActivate = this.onTabActivate.bind(this);

		this.createOnFocus = this.createOnFocus.bind(this);

		this.moveTab = this.moveTab.bind(this);
		this.onMoveTabLeft = this.onMoveTabLeft.bind(this);
		this.onMoveTabRight = this.onMoveTabRight.bind(this);

		this.onDuplicate = this.onDuplicate.bind(this);

		this.insertTab = this.insertTab.bind(this);
		this.onInsertTabBefore = this.onInsertTabBefore.bind(this);
		this.onInsertTabAfter = this.onInsertTabAfter.bind(this);

		this.activateTab = this.activateTab.bind(this);

		this.onAddTab = this.onAddTab.bind(this);
		this.initTabs = this.initTabs.bind(this);

		/**
		 * @type {ItemsAttributeManager}
		 */
		this.itemsManager = new ItemsAttributeManager({
			items: {
				isWrapper: true,
				attributes: {
					content: {
						alias: 'content',
						// default: '',
						default: n => `Content ${n+1}`
					},
				}
			},
			titles: {
				isWrapper: true,
				attributes: {
					content: {
						alias: 'title',
						// default: '',
						default: n => `Tab #${n+1}`
					},
				}
			}
		});

		this.state = {
			selectedTab: active !== undefined ? active : (items.length ? 0 : null),
			initialTabCount: 3
		};
	}

	/**
	 * Render tabs constructor form
	 *
	 */
	renderConstructorForm() {
		const {initialTabCount} = this.state;

		return (
			<form onSubmit={this.onConstructTabs}>
				<TextControl
					type="number"
					label={__('Tab Count', 'getwid')}
					onChange={initialTabCount => this.setState({initialTabCount})}
					value={initialTabCount}
					min="1"
				/>
				<Button isPrimary type="submit">
					{__('Create', 'getwid')}
				</Button>
			</form>
		);
	}

	/**
	 * Retrieve toolbar dropdown tabs controls
	 *
	 * @return {*[]}
	 */
	getTabsDropdown() {

		const {selectedTab} = this.state;

		const {
			attributes: {
				items
			}
		} = this.props;

		return [
			{
				icon: 'table-col-before',
				title: __('Add Tab Before', 'getwid'),
				isDisabled: selectedTab === null,
				onClick: this.onInsertTabBefore,
			},
			{
				icon: 'table-col-after',
				title: __('Add Tab After', 'getwid'),
				isDisabled: selectedTab === null,
				onClick: this.onInsertTabAfter,
			},
			{
				icon: 'arrow-left-alt2',
				title: __('Move Tab Left', 'getwid'),
				isDisabled: selectedTab === null || selectedTab === 0,
				onClick: this.onMoveTabLeft,
			},
			{
				icon: 'arrow-right-alt2',
				title: __('Move Tab Right', 'getwid'),
				isDisabled: selectedTab === null || selectedTab === items.length - 1,
				onClick: this.onMoveTabRight,
			},
			{
				icon: 'admin-page',
				title: __('Duplicate Tab', 'getwid'),
				isDisabled: selectedTab === null,
				onClick: this.onDuplicate,
			},
			{
				icon: 'trash',
				title: __('Delete Tab', 'getwid'),
				isDisabled: selectedTab === null,
				onClick: this.onDeleteTab,
			},
		];
	}

	render() {

		const {
			attributes: {
				items,
				titles,
				type,
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
						{/*{`Selected Tab: ${this.state.selectedTab}`}*/}
						<DropdownMenu
							icon="edit"
							label={__('Edit Tabs', 'getwid')}
							controls={this.getTabsDropdown()}
						/>
					</Toolbar>
				</BlockControls>,

				<Inspector {...this.props} key={'inspector'}/>,

				<div className={classnames(className,
					{
						[`wp-block-getwid-tabs--${type}`]: type !== ''
                    }
				)} key={'edit'}>
					<ul className="wp-block-getwid-tabs__nav-links">
						{titles.map((item, index) => (
							<li className="wp-block-getwid-tabs__nav-link" key={index}>

								<Tag className='wp-block-getwid-tabs__title-wrapper'>
									<a href={`#tab-${index}`}>
										<RichText
											tagName='span'
											className='wp-block-getwid-tabs__title'
											placeholder={__('Tab Title', 'getwid')}
											value={item.content}
											onChange={(value) => this.onChange({
												alias: 'title',
												index,
												value
											})}
											formattingControls={['bold', 'italic', 'strikethrough']}
											onSplit={() => null}
											unstableOnFocus={this.createOnFocus(index)}
											multiline={false}
										/>
									</a>
								</Tag>

							</li>
						))}

						{isSelected && (
							<li className="wp-block-getwid-tabs__nav-link wp-block-getwid-tabs__add-tab">
								<Tooltip text={__('Add tab', 'getwid')}>
									<span
										onClick={this.onAddTab}>
	                                        <Dashicon icon="plus-alt"/>
	                                    </span>
								</Tooltip>
							</li>
						)}

					</ul>

					{items.map((item, index) => (
						<div id={`tab-${index}`} className="wp-block-getwid-tabs__tab-content" key={index}>
							<RichText
								tag={'p'}
								placeholder={__('Tab Content', 'getwid')}
								value={item.content}
								onChange={(value) => this.onChange({
									alias: 'content',
									index,
									value
								})}
							/>
						</div>
					))}
				</div>
			]
		);
	}

	/**
	 *
	 * @param {boolean} refresh
	 */
	initTabs(refresh = false) {

		const {attributes: {active}} = this.props;

		const tabsEl = $(ReactDOM.findDOMNode(this));

		if (refresh) {
			tabsEl.tabs('refresh');
		} else {
			tabsEl
				.tabs({
					active: active !== undefined ? active : 0,
					activate: this.onTabActivate,
				});
		}

		// Fix for RichText space
		tabsEl.find('>.wp-block-getwid-tabs__nav-links a').on('keydown', function(e) {
			e.stopPropagation();
		});
	}

	componentDidMount() {
		this.initTabs();
	}

	componentDidUpdate(prevProps) {
		const {
			attributes: {
				items: prevItems,
				titles: prevTitles
			}
		} = prevProps;
		const {
			attributes: {
				items,
				titles
			}
		} = this.props;

		// Refresh tabs only if items or titles change
		if (prevItems !== items || prevTitles !== titles) {
			this.initTabs(!!prevItems.length);
		}

	}

	/**
	 * Creates an onFocus handler for a specified cell.
	 *
	 * @param {Object} selectedTab Object with `section`, `rowIndex`, and
	 *                              `columnIndex` properties.
	 *
	 * @return {Function} Function to call on focus.
	 */
	createOnFocus(selectedTab) {
		return () => {
			this.activateTab(selectedTab);
		};
	}

	/**
	 *
	 * @param {number} index
	 */
	activateTab(index) {
		$(ReactDOM.findDOMNode(this)).tabs('option', 'active', index);
	}

	/**
	 *
	 * @param {Event} event
	 * @param {{newTab: jQuery, newPanel: jQuery, oldTab: jQuery, oldPanel: jQuery}} ui
	 */
	onTabActivate(event, ui) {
		const selectedTab = ui.newTab.length ? ui.newTab.parent().children('li').index(ui.newTab) : null;

		// Synchronize state with active tab
		this.setState({
			selectedTab
		});
	}

	/**
	 *
	 * @param {Event} event
	 */
	onConstructTabs(event) {

		event.preventDefault();

		const {setAttributes} = this.props;
		let {initialTabCount} = this.state;

		const itemsCount = parseInt(initialTabCount, 10) || 3;

		setAttributes(this.itemsManager.createItems({itemsCount}));

		this.setState({
			selectedTab: 0
		});
	}

	onDeleteTab() {
		const {selectedTab} = this.state;

		if (selectedTab === null) {
			return;
		}

		const {
			attributes: {
				items,
				active
			}
		} = this.props;

		const {attributes, setAttributes} = this.props;

		const changed = this.itemsManager.deleteItem(attributes, {index: selectedTab});

		// Reset active attribute if it greater than items count
		if (active >= items.length - 1) {
			changed['active'] = undefined;
		}

		setAttributes(changed);

		// If removing last item then reset selectedTab
		if (items.length === 1) {
			this.setState({selectedTab: null});
		}
	}

	/**
	 * On plus button click - append tab
	 */
	onAddTab() {
		const {
			attributes: {
				items
			},
		} = this.props;

		this.insertTab({
			index: items.length
		});
	}

	/**
	 * Inserts a tab before the currently selected tab.
	 */
	onInsertTabBefore() {
		const {selectedTab} = this.state;

		if (selectedTab === null) {
			return;
		}

		this.insertTab({
			index: selectedTab
		});
	}

	/**
	 * Inserts a tab after the currently selected tab.
	 */
	onInsertTabAfter() {
		const {selectedTab} = this.state;

		if (selectedTab === null) {
			return;
		}

		this.insertTab({
			index: selectedTab + 1
		});
	}

	onDuplicate() {
		const {selectedTab} = this.state;
		const {attributes, setAttributes} = this.props;

		if (selectedTab === null) {
			return;
		}

		setAttributes(this.itemsManager.duplicateItem(attributes, {
			index: selectedTab
		}));

		this.activateTab(selectedTab + 1);
	}

	/**
	 *
	 * @param {number} options.index
	 * @param {Object} [options.item] Item pseudo-state to insert
	 */
	insertTab({
		index,
		item
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.insertItem(attributes, {
			index: index,
			item
		}));

		this.activateTab(index);
	}

	onMoveTabLeft() {
		const {selectedTab} = this.state;

		if (selectedTab === null) {
			return;
		}

		this.moveTab({
			from: selectedTab,
			to: selectedTab - 1
		})
	}

	onMoveTabRight() {
		const {selectedTab} = this.state;

		if (selectedTab === null) {
			return;
		}

		this.moveTab({
			from: selectedTab,
			to: selectedTab + 1
		})
	}

	/**
	 *
	 * @param {number} options.from
	 * @param {number} options.to
	 */
	moveTab({
		from,
		to
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.moveItem(attributes, {
			index: from,
			toIndex: to
		}));

		this.activateTab(to);
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