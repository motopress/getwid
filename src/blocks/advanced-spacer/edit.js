import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss'

const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
	ResizableBox,
} = wp.components;

class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		
		const {
			attributes: {
				height,
				isHideDesktop,
				isHideTablet,			
				isHideMobile,
			},
			isSelected,
			className,
			setAttributes,
			toggleSelection,
		} = this.props;

		const units = (/\d+(\w+)/g).exec(height)[1];

		return (
			<Fragment>
				<Inspector {...this.props} />
				<ResizableBox
					className={ classnames(
						className, { 
							'is-selected'    : isSelected,
							'is-hide-desktop': isHideDesktop,
							'is-hide-tablet' : isHideTablet,
							'is-hide-mobile' : isHideMobile,
						}
					) }
					size={ {
						height,
					} }
					minHeight="20"
					enable={ {
						top: false,
						right: false,
						bottom: (units != 'px' ? false : true),
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					} }
					onResizeStop={ ( event, direction, elt, delta ) => {
						const val = parseInt( height , 10 ) + delta.height;

						setAttributes( {
							height: val + units,
						} );
						toggleSelection( true );
					} }
					onResizeStart={ () => {
						toggleSelection( false );
					} }
				/>
			</Fragment>
		);
	}
}

export default (Edit);