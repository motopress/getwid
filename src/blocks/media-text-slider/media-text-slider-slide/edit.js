// import { get, isEqual } from 'lodash';
// import classnames from 'classnames';
// import render_style from 'GetwidUtils/render-style';
// import {SliderContext} from './../context';
// const {
// 	prepareGradientStyle,
// 	prepareBackgroundImageStyles,
// 	convertHorizontalAlignToStyle,
// 	convertVerticalAlignToStyle
// } = render_style;

// const { __ , sprintf } = wp.i18n;

// const {
// 	InnerBlocks,
// } = wp.editor;

const {
	Component,
	Fragment,
} = wp.element;

// const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide-content' ];

// const TEMPLATE = [
// 	['getwid/media-text-slider-slide-content' ]
// ];

class Edit extends Component {
	// constructor( props ) {
	// 	super( ...arguments );
	// }

	// componentDidMount() {

	// }

// 	componentDidUpdate(prevProps) {
// 		const {
// 			setAttributes
// 		} = this.props;		
// 		// console.warn('UPDATE FROM CHILD');


// 		if (typeof prevProps.attributes.parent != 'undefined' && typeof prevProps.attributes.parent.attributes != 'undefined'){
// 			if (!isEqual(prevProps.attributes.parent.attributes, this.props.attributes.parent.attributes)){

// 				console.log(this.props.attributes.parent.attributes);
// 				setAttributes({ outerParent : this.props.attributes.parent });
// 				console.error('HERE WE GO');
// /*				if (typeof imgObj != 'undefined'){
// 					this.onSelectMedia( imgObj );
// 				}*/
// 			}
// 		}

// 	}

	render() {
/*		const {
			setAttributes
		} = this.props;*/

			return (
				<Fragment>
					<div>EDIT</div>
				</Fragment>
			);
	}
}

export default ( Edit );