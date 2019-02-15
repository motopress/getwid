import classnames from 'classnames';
import ItemsAttributeManager from 'GetwidUtils/items-attribute-utils';
import Inspector from './inspector';
import {without} from "lodash";
import './editor.scss'

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
	IconButton
} = wp.components;

const { Fragment } = wp.element;

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

		this.onConstructToggle = this.onConstructToggle.bind(this);
		this.onDeleteItem = this.onDeleteItem.bind(this);
		this.onToggleActivate = this.onToggleActivate.bind(this);

		this.moveToggle = this.moveToggle.bind(this);
		this.onMoveToggleTop = this.onMoveToggleTop.bind(this);
		this.onMoveToggleBottom = this.onMoveToggleBottom.bind(this);

		this.onDuplicate = this.onDuplicate.bind(this);

		this.insertToggle = this.insertToggle.bind(this);
		this.onInsertToggleBefore = this.onInsertToggleBefore.bind(this);
		this.onInsertToggleAfter = this.onInsertToggleAfter.bind(this);

		this.activateToggle = this.activateToggle.bind(this);

		this.onAddToggle = this.onAddToggle.bind(this);
		this.initToggle = this.initToggle.bind(this);

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
			selectedToggle: null,
			activeToggles: [],
			// selectedToggle: active !== undefined ? active : (items.length ? 0 : null),
			initialToggleCount: 3
		};
	}

	/**
	 * Render toggle constructor form
	 *
	 */
	renderConstructorForm() {
		const {initialToggleCount} = this.state;

		return (
			<form onSubmit={this.onConstructToggle}>
				<TextControl
					type="number"
					label={__('Items Count', 'getwid')}
					onChange={initialToggleCount => this.setState({initialToggleCount})}
					value={initialToggleCount}
					min="1"
				/>
				<Button isPrimary type="submit">
					{__('Create', 'getwid')}
				</Button>
			</form>
		);
	}

	/**
	 * Retrieve toolbar dropdown toggle controls
	 *
	 * @return {*[]}
	 */
	getToggleDropdown() {

		const {selectedToggle} = this.state;

		const {
			attributes: {
				items
			}
		} = this.props;

		return [
			{
				icon: 'table-row-before',
				title: __('Add Item Before', 'getwid'),
				isDisabled: selectedToggle === null,
				onClick: this.onInsertToggleBefore,
			},
			{
				icon: 'table-row-after',
				title: __('Add Item After', 'getwid'),
				isDisabled: selectedToggle === null,
				onClick: this.onInsertToggleAfter,
			},
			{
				icon: 'arrow-up-alt2',
				title: __('Move Item Top', 'getwid'),
				isDisabled: selectedToggle === null || selectedToggle === 0,
				onClick: this.onMoveToggleTop,
			},
			{
				icon: 'arrow-down-alt2',
				title: __('Move Item Down', 'getwid'),
				isDisabled: selectedToggle === null || selectedToggle === items.length - 1,
				onClick: this.onMoveToggleBottom,
			},
			{
				icon: 'admin-page',
				title: __('Duplicate Item', 'getwid'),
				isDisabled: selectedToggle === null,
				onClick: this.onDuplicate,
			},
			{
				icon: 'trash',
				title: __('Delete Item', 'getwid'),
				isDisabled: selectedToggle === null,
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

		const {selectedToggle, activeToggles} = this.state;

		const Tag = headerTag;

		return (
			[
				<BlockControls key={'toolbar'}>
					<Toolbar>
						{/*{`Selected Item: ${this.state.selectedToggle}`}*/}
						<DropdownMenu
							icon="edit"
							label={__('Edit', 'getwid')}
							controls={this.getToggleDropdown()}
						/>
					</Toolbar>
				</BlockControls>,

				<Inspector {...this.props} key={'inspector'}/>,

				<div className={classnames(className, {
						'wp-block-getwid-toggle--icon-left': iconPosition === 'left'
					})}
					data-active-element={active}
					key={'edit'}
				>

					{titles.map((item, index) => {

						// Add active class to selected item (Highlight)
						let row_classes = 'wp-block-getwid-toggle__row';
						row_classes = classnames(row_classes, {
							'getwid-active': selectedToggle == index,
							'wp-block-getwid-toggle__row--active' : activeToggles.includes(index)
						} );

						return (
							<div className={row_classes}>
								<div className="wp-block-getwid-toggle__header-wrapper">									
									<Tag className='wp-block-getwid-toggle__header'>
										<a href="#">
											<div className="wp-block-getwid-toggle__edit-area">
												<RichText
													tagName='span'
													className='wp-block-getwid-toggle__header-title'
													placeholder={__('Title', 'getwid')}
													value={item.content}
													onChange={(value) => this.onChange({
														alias: 'title',
														index,
														value
													})}
													formattingControls={['bold', 'italic', 'strikethrough']}
													unstableOnSplit={() => null}
													multiline={false}
												/>
											</div>

											<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--active"><i className={iconClose}></i></span>
											<span className="wp-block-getwid-toggle__icon wp-block-getwid-toggle__icon--passive"><i className={iconOpen}></i></span>
										</a>
									</Tag>
								</div>
								<div className="wp-block-getwid-toggle__content">
									<RichText
										tag={'p'}
										placeholder={__('Enter text here...', 'getwid')}
										value={items[index].content}
										onChange={(value) => this.onChange({
											alias: 'content',
											index,
											value
										})}
									/>
								</div>
							</div>	
						);
					})}

					{isSelected && (
						<div className="wp-block-getwid-toggle__add-toggle">
							<IconButton
								icon="insert"
								onClick={this.onAddToggle}
								label={__('Add Item', 'getwid')}
							/>
						</div>
					)}

				</div>
			]
		);
	}

	/**
	 *
	 * @param {boolean} refresh
	 */
	initToggle(refresh = false) {

		const {
			attributes: {
				active
			}
		} = this.props;

		let that = this;
		const ToggleEl = $(ReactDOM.findDOMNode(this));

		if (!refresh) {

			if (active !== undefined && active != 'false'){
				if (typeof active === 'string' && active == 'all'){
					const row = $(ReactDOM.findDOMNode(this)).find('.wp-block-getwid-toggle__row');
					row.addClass('wp-block-getwid-toggle__row--active');
					row.find('.wp-block-getwid-toggle__content').slideDown();
				} else {
					this.activateToggle(parseInt(active, 10));
				}
			}

			ToggleEl.on('click', '.wp-block-getwid-toggle__header-wrapper', function(e){
				e.preventDefault();
				var row = $(this).parent();
				if (row.hasClass('wp-block-getwid-toggle__row--active')){
					that.onToggleActivate(row, true);
					row.removeClass('wp-block-getwid-toggle__row--active');
				} else {
					that.onToggleActivate(row, false);
					row.addClass('wp-block-getwid-toggle__row--active');
				}

				row.find('.wp-block-getwid-toggle__content').slideToggle( 400 );
			});
		}
	}

	componentDidMount() {
		this.initToggle();
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
			},
			isSelected
		} = this.props;

		const {selectedToggle} = this.state;

		// Remove active class if element not Selected (Click out of element)
		if ( !isSelected && typeof selectedToggle != 'object') {
			this.setState({selectedToggle: null});
		}

		// Refresh toggle only if items or titles change
		if (prevItems !== items || prevTitles !== titles) {
			this.initToggle(!!prevItems.length);
		}

	}

	/**
	 *
	 * @param {number} index
	 */
	activateToggle(index) {
		const row = $(ReactDOM.findDOMNode(this)).find('.wp-block-getwid-toggle__row').eq(index);
		row.addClass('wp-block-getwid-toggle__row--active');
		row.find('.wp-block-getwid-toggle__content').slideDown();
	}

	/**
	 *
	 * @param {Object jQuery selector} row
	 */
	onToggleActivate(row, remove) {
		let {activeToggles} = this.state;
		const selectedToggle = row.length ? row.parent().children('.wp-block-getwid-toggle__row').index(row) : null;

		if (remove){
			activeToggles = without(activeToggles, selectedToggle);
		} else {
			activeToggles.push(selectedToggle);
		}

		// Synchronize state with active toggle
		this.setState({
			activeToggles,
			selectedToggle
		});
	}

	/**
	 *
	 * @param {Event} event
	 */
	onConstructToggle(event) {

		event.preventDefault();

		const {setAttributes} = this.props;
		let {initialToggleCount} = this.state;

		const itemsCount = parseInt(initialToggleCount, 10) || 3;

		setAttributes(this.itemsManager.createItems({itemsCount}));

		this.setState({
			selectedToggle: 0
		});
	}

	onDeleteItem() {
		const {selectedToggle} = this.state;

		if (selectedToggle === null) {
			return;
		}

		const {
			attributes: {
				items,
				active
			}
		} = this.props;

		const {attributes, setAttributes} = this.props;

		const changed = this.itemsManager.deleteItem(attributes, {index: selectedToggle});

		// Reset active attribute if it greater than items count
		if (active >= items.length - 1) {
			changed['active'] = undefined;
		}

		setAttributes(changed);

		// If removing last item then reset selectedToggle
		if (items.length === 1) {
			this.setState({selectedToggle: null});
		}
	}

	/**
	 * On plus button click - append row
	 */
	onAddToggle() {
		const {
			attributes: {
				items
			},
		} = this.props;

		this.insertToggle({
			index: items.length
		});

	}

	/**
	 * Inserts a row before the currently selected toggle.
	 */
	onInsertToggleBefore() {
		const {selectedToggle} = this.state;

		if (selectedToggle === null) {
			return;
		}

		this.insertToggle({
			index: selectedToggle
		});
	}

	/**
	 * Inserts a row after the currently selected toggle.
	 */
	onInsertToggleAfter() {
		const {selectedToggle} = this.state;

		if (selectedToggle === null) {
			return;
		}

		this.insertToggle({
			index: selectedToggle + 1
		});
	}

	onDuplicate() {
		const {selectedToggle} = this.state;
		const {attributes, setAttributes} = this.props;

		if (selectedToggle === null) {
			return;
		}

		setAttributes(this.itemsManager.duplicateItem(attributes, {
			index: selectedToggle
		}));

		this.activateToggle(selectedToggle + 1);
	}

	/**
	 *
	 * @param {number} options.index
	 * @param {Object} [options.item] Item pseudo-state to insert
	 */
	insertToggle({
		index,
		item
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.insertItem(attributes, {
			index: index,
			item
		}));

		this.activateToggle(index);
	}

	onMoveToggleTop() {
		const {selectedToggle} = this.state;

		if (selectedToggle === null) {
			return;
		}

		this.moveToggle({
			from: selectedToggle,
			to: selectedToggle - 1
		})
	}

	onMoveToggleBottom() {
		const {selectedToggle} = this.state;

		if (selectedToggle === null) {
			return;
		}

		this.moveToggle({
			from: selectedToggle,
			to: selectedToggle + 1
		})
	}

	/**
	 *
	 * @param {number} options.from
	 * @param {number} options.to
	 */
	moveToggle({
		from,
		to
	}) {
		const {attributes, setAttributes} = this.props;

		setAttributes(this.itemsManager.moveItem(attributes, {
			index: from,
			toIndex: to
		}));

		const selectedToggle = to;
		this.setState({
			selectedToggle
		});

		this.activateToggle(to);
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