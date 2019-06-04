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
	Disabled
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


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);		
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	render() {
		const {
			attributes: {
				align,
				minHeight,

				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
			},
			className,
			setAttributes,
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const current_post_type = select("core/editor").getCurrentPostType();

		const wrapperClass = classnames(
			className,
			align ? `align${ align }` : null,
		);

        const wrapperStyle = {
			minHeight: minHeight,
        };

		const containerClass = classnames(
			`${className}__content_container`,
			{
				[`getwid-padding-top-${paddingTop}`]: paddingTop !== 'custom' && paddingTop !== '',
				[`getwid-padding-bottom-${paddingBottom}`]: paddingBottom !== 'custom' && paddingBottom !== '',
				[`getwid-padding-left-${paddingLeft}`]: paddingLeft !== 'custom' && paddingLeft !== '',
				[`getwid-padding-right-${paddingRight}`]: paddingRight !== 'custom' && paddingRight !== '',

				[`getwid-padding-tablet-top-${paddingTopTablet}`]: paddingTopTablet !== 'custom' && paddingTopTablet !== '',
				[`getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== 'custom' && paddingBottomTablet !== '',
				[`getwid-padding-tablet-left-${paddingLeftTablet}`]: paddingLeftTablet !== 'custom' && paddingLeftTablet !== '',
				[`getwid-padding-tablet-right-${paddingRightTablet}`]: paddingRightTablet !== 'custom' && paddingRightTablet !== '',

				[`getwid-padding-mobile-top-${paddingTopMobile}`]: paddingTopMobile !== 'custom' && paddingTopMobile !== '',
				[`getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== 'custom' && paddingBottomMobile !== '',
				[`getwid-padding-mobile-left-${paddingLeftMobile}`]: paddingLeftMobile !== 'custom' && paddingLeftMobile !== '',
				[`getwid-padding-mobile-right-${paddingRightMobile}`]: paddingRightMobile !== 'custom' && paddingRightMobile !== '',
			}
		);		

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
						...{changeState},
						...{getState},
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
						<div className={'background_image_wrapper'} style={{backgroundImage: 'url(https://picsum.photos/1920/1080?random)'}}></div>
						<div className={containerClass}>
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