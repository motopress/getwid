/**
* External dependencies
*/
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss'


/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
const {Component, Fragment} = wp.element;
const {
	ResizableBox,
} = wp.components;


/**
* Create an Component
*/
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
							'getwid-hide-desktop': isHideDesktop,
							'getwid-hide-tablet' : isHideTablet,
							'getwid-hide-mobile' : isHideMobile,
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