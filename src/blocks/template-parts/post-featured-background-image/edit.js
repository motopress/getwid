/**
* External dependencies
*/
import Inspector from './inspector';
import './editor.scss';
import classnames from "classnames";


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	ServerSideRender,
	Disabled,
	Dashicon
} = wp.components;
import { __ } from 'wp.i18n';
const {
	BlockAlignmentToolbar,
	BlockControls,
	InnerBlocks,
} = wp.editor;
const {
	select,
} = wp.data;


/**
* Module Constants
*/
const TEMPLATE = [
    [ 'core/paragraph' ],
];
const baseClass = 'wp-block-getwid-template-post-featured-background-image';


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );	
	}

	render() {
		const {
			attributes: {
				align,
				minHeight,

				paddingTopValue,
				paddingBottomValue,
				paddingLeftValue,
				paddingRightValue,
				
				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
			},
			className,
			setAttributes,
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

		const wrapperClass = classnames(
			className,
			align ? `align${ align }` : null,
		);

        const wrapperStyle = {
			minHeight: minHeight,
        };

		const containerClass = classnames(
			`${baseClass}__content_container`,
			{
				[`getwid-padding-top-${paddingTop}`]: paddingTop !== 'custom' && paddingTop !== '',
				[`getwid-padding-bottom-${paddingBottom}`]: paddingBottom !== 'custom' && paddingBottom !== '',
				[`getwid-padding-left-${paddingLeft}`]: paddingLeft !== 'custom' && paddingLeft !== '',
				[`getwid-padding-right-${paddingRight}`]: paddingRight !== 'custom' && paddingRight !== '',

				[`getwid-padding-tablet-top-${paddingTopTablet}`]: paddingTopTablet !== '',
				[`getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== '',
				[`getwid-padding-tablet-left-${paddingLeftTablet}`]: paddingLeftTablet !== '',
				[`getwid-padding-tablet-right-${paddingRightTablet}`]: paddingRightTablet !== '',

				[`getwid-padding-mobile-top-${paddingTopMobile}`]: paddingTopMobile !== '',
				[`getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== '',
				[`getwid-padding-mobile-left-${paddingLeftMobile}`]: paddingLeftMobile !== '',
				[`getwid-padding-mobile-right-${paddingRightMobile}`]: paddingRightMobile !== '',
			}
		);		

        const containerStyle = {
			...(paddingTop === 'custom' ? {paddingTop: paddingTopValue} : []),
			...(paddingBottom === 'custom' ? {paddingBottom: paddingBottomValue} : []),
			...(paddingLeft === 'custom' ? {paddingLeft: paddingLeftValue} : []),
			...(paddingRight === 'custom' ? {paddingRight: paddingRightValue} : [])
        };

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							controls= {[ 'wide', 'full', 'left', 'center', 'right' ]}
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>					
					</BlockControls>

					<div style={wrapperStyle} className={wrapperClass}>

						<div className="components-placeholder editor-media-placeholder background_image_wrapper">
							<div className="components-placeholder__label">
								<Dashicon icon="format-image" />
							</div>
							<div className="components-placeholder__instructions">{__('Post Featured Background Image', 'getwid')}</div>
						</div>

						<div className={containerClass} style={containerStyle}>
							<InnerBlocks
								template={ TEMPLATE }
								templateInsertUpdatesSelection={ false }
								templateLock={ false }
							/>
						</div>
					</div>
				</Fragment>
			);			
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-featured-background-image"
							attributes={this.props.attributes}
						/>
					</Disabled>
				</Fragment>
			);
		}

	}
}

export default ( Edit );