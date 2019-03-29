/**
* External dependencies
*/
import render_style from 'GetwidUtils/render-style';
const {
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle
} = render_style;


/**
* WordPress dependencies
*/
const { __ , sprintf } = wp.i18n;
const {
	InnerBlocks,
} = wp.editor;
const {
	Component,
	Fragment,
} = wp.element;


/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide-content' ];
const TEMPLATE = [
	['getwid/media-text-slider-slide-content' ]
];


/**
* Create an Component
*/
class Edit extends Component {
	
	constructor( props ) {
		super( ...arguments );
	}

	componentDidMount() {}

	componentDidUpdate(prevProps, prevState) {}

	render() {
		const {
			attributes: {
				id,
				outerParent,
			},
			className,
			setAttributes
		} = this.props;

		const contentStyle = {
			paddingTop : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingTop != 'undefined' ? outerParent.attributes.paddingTop : null),
			paddingBottom : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingBottom != 'undefined' ? outerParent.attributes.paddingBottom : null),
			paddingLeft : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingLeft != 'undefined' ? outerParent.attributes.paddingLeft : null),
			paddingRight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingRight != 'undefined' ? outerParent.attributes.paddingRight : null),
			justifyContent : (typeof outerParent != 'undefined' && typeof outerParent.attributes.horizontalAlign != 'undefined' ? convertHorizontalAlignToStyle(outerParent.attributes.horizontalAlign) : null),
			alignItems : (typeof outerParent != 'undefined' && typeof outerParent.attributes.verticalAlign != 'undefined' ? convertVerticalAlignToStyle(outerParent.attributes.verticalAlign) : null),
            minHeight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.minHeight != 'undefined' ? outerParent.attributes.minHeight : null),
		};

		const contentInnerWrapperStyle = {
            maxWidth : (typeof outerParent != 'undefined' && typeof outerParent.attributes.contentMaxWidth != 'undefined' ? outerParent.attributes.contentMaxWidth : '80%'),
			width: '100%',
		};

		return (	
			<Fragment>
				<div className={`${className}__content-wrapper slide-${ id }`}>
		
					<div style={contentStyle} className={`${className}__content`}>
						<div style={contentInnerWrapperStyle}>
							<InnerBlocks
								templateLock="all"
								template={ TEMPLATE }
								templateInsertUpdatesSelection={false}
								allowedBlocks={ ALLOWED_BLOCKS }
							/>
						</div>
					</div>
				
				</div>
			</Fragment>
		);
	}
}

export default ( Edit );