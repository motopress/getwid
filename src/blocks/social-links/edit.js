import classnames from 'classnames';
import Inspector from './inspector';
import { merge, isEqual, escape, unescape } from "lodash";
import move from 'lodash-move';
import './editor.scss'

/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {Component, Fragment} = wp.element;

const {
	RichText,
	BlockControls,
	AlignmentToolbar,
	withColors
} = wp.editor;

const {compose} = wp.compose;

const {
	TextControl,
	Button,
	Toolbar,
	DropdownMenu,
	IconButton
} = wp.components;

const {jQuery: $} = window;

/**
 * Create an Inspector Controls wrapper Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.updateArrValues = this.updateArrValues.bind(this);

		this.onDeleteIcon = this.onDeleteIcon.bind(this);
		this.moveIcon = this.moveIcon.bind(this);
		this.onMoveIconLeft = this.onMoveIconLeft.bind(this);
		this.onMoveIconRight = this.onMoveIconRight.bind(this);
		this.onDuplicate = this.onDuplicate.bind(this);
		this.insertIcon = this.insertIcon.bind(this);
		this.onInsertIconBefore = this.onInsertIconBefore.bind(this);
		this.onInsertIconAfter = this.onInsertIconAfter.bind(this);
		this.onSelectIcon = this.onSelectIcon.bind(this);
		this.activateIcon = this.activateIcon.bind(this);
		this.onAddIcon = this.onAddIcon.bind(this);

		this.state = {
			selectedIcon: undefined,
		};
	}

	updateArrValues ( value, index ) {

		//Recursive iterate object value
		const deepMap = (obj, cb) => {
			var out = {};
		  
			Object.keys(obj)
		  	.forEach(function (k) {
		      var val;
		      if (obj[k] !== null && typeof obj[k] === 'object') {
		        val = deepMap(obj[k], cb);
		      } else {
		        val = cb(obj[k], k);
		      }

		      out[k] = val;
		    });
		  
		  return out;
		}

		//Replace undefined to ''
		value = deepMap(value, function (v, k) {
			if (typeof v == 'undefined'){
				v = '';
			}
			return v;
		});

		const { attributes, setAttributes } = this.props;
		const { icons } = attributes;

		const newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = {
					...item,
					...value
				};
				// item = merge(item, value);
			}
			return item;
		} );

		setAttributes( {
			icons: newItems,
		} );
	};

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	/**
	 * Retrieve toolbar dropdown icons controls
	 *
	 * @return {*[]}
	 */
	getIcosDropdown() {

		const {selectedIcon} = this.state;

		const {
			attributes: {
				icons
			}
		} = this.props;

		return [
			{
				icon: 'table-col-before',
				title: __('Add Item Before', 'getwid'),
				isDisabled: selectedIcon === null,
				onClick: this.onInsertIconBefore,
			},
			{
				icon: 'table-col-after',
				title: __('Add Item After', 'getwid'),
				isDisabled: selectedIcon === null,
				onClick: this.onInsertIconAfter,
			},
			{
				icon: 'arrow-left-alt2',
				title: __('Move Item Left', 'getwid'),
				isDisabled: selectedIcon === null || selectedIcon === 0,
				onClick: this.onMoveIconLeft,
			},
			{
				icon: 'arrow-right-alt2',
				title: __('Move Item Right', 'getwid'),
				isDisabled: selectedIcon === null || selectedIcon === icons.length - 1,
				onClick: this.onMoveIconRight,
			},
			{
				icon: 'admin-page',
				title: __('Duplicate Item', 'getwid'),
				isDisabled: selectedIcon === null,
				onClick: this.onDuplicate,
			},
			{
				icon: 'trash',
				title: __('Delete Item', 'getwid'),
				isDisabled: selectedIcon === null,
				onClick: this.onDeleteIcon,
			},
		];
	}

	render() {

		const {
			attributes: {
				align,
				textAlignment,
				icons,
				iconsStyle,
				iconsSize,
				iconsSpacing,
			},
			className,
			setAttributes,
			isSelected,

			setBackgroundColor,
			setTextColor,
			
			backgroundColor,
			textColor,			
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;
		const updateArrValues = this.updateArrValues;

		const {selectedIcon} = this.state;

		const icon_render = (item) => {
			const icon_block = () => {

				return(
					<Fragment>
						<span
							className={
								classnames(`${className}__wrapper`,{				
									'has-background': (backgroundColor.color) && 'stacked' == iconsStyle,
									[ backgroundColor.class ]: (backgroundColor.class) && 'stacked' == iconsStyle,
									'has-text-color': textColor.color,
									[ textColor.class ]: textColor.class,
								})
							}
							style={{
								color: (textColor.color ? textColor.color : undefined),
								backgroundColor : (iconsStyle == 'stacked' ? (backgroundColor.color ? backgroundColor.color : undefined) : undefined)
							}}							
						>
							<i
							style={{
								color: (item.color ? item.color : undefined),
								backgroundColor : (iconsStyle == 'stacked' ? (item.background ? item.background : undefined) : undefined)
							}}
							className={item.icon}
							data-color={(item.color ? item.color : undefined)}
							data-bg-color={(item.background ? item.background : undefined)}
							></i>
						</span>
						{ item.title && (
							<span className={`${className}__label`}>{item.title}</span>
						)}
					</Fragment>
				);
			};

			return (
				<a
					className={`${className}__link`}
					href={(item.link !='' ? item.link : '#')}
					target={ (item.linkTarget == '_blank' ? item.linkTarget : undefined ) }
					rel={ (item.rel ? item.rel : undefined ) }
					onClick={(e)=>e.preventDefault()}
				>
					{icon_block()}
				</a>
			);
		};

		return (
			[
				<BlockControls key={'toolbar'}>
					<Toolbar>
						<DropdownMenu
							icon="edit"
							label={__('Edit Icons', 'getwid')}
							controls={this.getIcosDropdown()}
						/>
					</Toolbar>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ textAlignment => setAttributes({textAlignment}) }
					/>					
				</BlockControls>,

				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState},
					...{updateArrValues},
				}} key={'inspector'}/>,

				<ul className={classnames(className,
					`is-${iconsSpacing}-spacing`,
					{
						[`is-stacked`]: iconsStyle === 'stacked',
						[`is-framed`]: iconsStyle === 'framed',
		
						[`is-icons-left`]: 'left' === textAlignment,
						[`is-icons-center`]: 'center' === textAlignment,
						[`is-icons-right`]: 'right' === textAlignment,
					}	
				)}
				key={'edit'} style={{
					fontSize: iconsSize,
				}}>
					{icons.map((item, index) => {

					const item_classes = classnames(`${className}__item`, {
						'icon-selected': selectedIcon == index,
					} );

					return(
						<li
							className={item_classes}
							onClick={()=>{
								this.onSelectIcon(index);
							}}
						>
							{icon_render(item)}
						</li>
					);
					})}

					{isSelected && (
						<span className={`${className}__link ${className}__add-icon`}>
							<IconButton
								icon="insert"
								onClick={this.onAddIcon}
								label={__('Add Item', 'getwid')}
							/>
						</span>
					)}
				</ul>
			]
		);
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {
		const {
			attributes: {
				icons,
			},
			isSelected
		} = this.props;

		const {selectedIcon} = this.state;

		// Remove active class if element not Selected (Click out of element)
		if ( !isSelected && typeof selectedIcon != 'object') {
			this.setState({selectedIcon: null});
		}
	}

	/**
	 *
	 * @param {number} index
	 */
	activateIcon(index) {
		this.setState({selectedIcon: index});
	}


	onSelectIcon(index){
		this.setState({
			selectedIcon: index 
		});
	}

	onDeleteIcon() {
		const {selectedIcon} = this.state;

		if (selectedIcon === null) {
			return;
		}

		const {
			attributes: {
				icons,
			},
			setAttributes
		} = this.props;

		setAttributes({
			icons: icons.filter( (item, index) => index !== selectedIcon )
		});

		this.setState({selectedIcon: null});
	}

	/**
	 * On plus button click - append icon
	 */
	onAddIcon() {
		const {
			attributes: {
				icons
			},
		} = this.props;

		this.insertIcon({
			index: icons.length
		});
	}

	/**
	 * Inserts a icon before the currently selected icon.
	 */
	onInsertIconBefore() {
		const {selectedIcon} = this.state;

		if (selectedIcon === null) {
			return;
		}

		this.insertIcon({
			index: selectedIcon
		});
	}

	/**
	 * Inserts a icon after the currently selected icon.
	 */
	onInsertIconAfter() {
		const {selectedIcon} = this.state;

		if (selectedIcon === null) {
			return;
		}

		this.insertIcon({
			index: selectedIcon + 1
		});
	}

	onDuplicate() {
		const {selectedIcon} = this.state;
		const {
			attributes: {
				icons
			},
			setAttributes
		} = this.props;

		if (selectedIcon === null) {
			return;
		}


		setAttributes(
			{ icons: [...icons.slice(0, selectedIcon), icons[selectedIcon], ...icons.slice(selectedIcon)] }
		);

		this.activateIcon(selectedIcon + 1);
	}

	/**
	 *
	 * @param {number} options.index
	 */
	insertIcon({
		index
	}) {
		const {
			attributes: {
				icons
			},
			setAttributes
		} = this.props;

		const icon = { icon: 'fab fa-wordpress', title: __('WordPress', 'getwid'), color: '', link: '#', linkTarget: undefined, rel: '' };

		setAttributes(
			{ icons: [...icons.slice(0, index), icon, ...icons.slice(index)] }
		);
	}

	onMoveIconLeft() {
		const {selectedIcon} = this.state;

		if (selectedIcon === null) {
			return;
		}

		this.moveIcon({
			from: selectedIcon,
			to: selectedIcon - 1
		})
	}

	onMoveIconRight() {
		const {selectedIcon} = this.state;

		if (selectedIcon === null) {
			return;
		}

		this.moveIcon({
			from: selectedIcon,
			to: selectedIcon + 1
		})
	}

	/**
	 *
	 * @param {number} options.from
	 * @param {number} options.to
	 */
	moveIcon({
		from,
		to
	}) {
		const {
			attributes: {
				icons,
			},
			setAttributes
		} = this.props;

		setAttributes({
			icons: move(icons, from, to)
		});

		this.activateIcon(to);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );