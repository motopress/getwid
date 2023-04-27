/**
 * Internal dependencies
 */
import Inspector from './inspector';
import GoogleFontLoader from 'react-google-font-loader';
import { isEqual } from "lodash";

import './editor.scss';
import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;


const { serverSideRender: ServerSideRender } = wp;
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const {
	ToolbarGroup
} = wp.components;
const { BlockControls, AlignmentToolbar, withColors } = wp.blockEditor || wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-countdown';


/**
* Create an Component
*/
class Edit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState = this.getState.bind(this);
		this.initCountdown = this.initCountdown.bind(this);
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getState ( value ) {
		return this.state[ value ];
	}

	initCountdown( block ) {

			let dataWrapper = $( `.${baseClass}__content:not('.init-countdown')`, block );

			if ( dataWrapper.length ) {

				dataWrapper.addClass('init-countdown');

				var dateTime = dataWrapper.data('datetime');
				var years = dataWrapper.data('years');
				var months = dataWrapper.data('months');
				var weeks = dataWrapper.data('weeks');
				var days = dataWrapper.data('days');
				var hours = dataWrapper.data('hours');
				var minutes = dataWrapper.data('minutes');
				var seconds = dataWrapper.data('seconds');
				var backgroundColor = dataWrapper.data('bg-color');

				var dateTo = (dateTime == 'negative' ? '' : dateTime);

				var dateFormat = '';

				if (years){
					dateFormat +='Y';
				}
				if (months){
					dateFormat +='O';
				}
				if (weeks){
					dateFormat +='W';
				}
				if (days){
					dateFormat +='D';
				}
				if (hours){
					dateFormat +='H';
				}
				if (minutes){
					dateFormat +='M';
				}
				if (seconds){
					dateFormat +='S';
				}

				if ( typeof dataWrapper.countdown === "function" ) {

					dataWrapper.countdown( {
						until: dateTo,
						format: dateFormat,
						onTick: () => {
							if ( backgroundColor ) {
								$( '.countdown-section', dataWrapper ).css( 'background-color', backgroundColor );
							}
						}
					} );
				}
			}
	}

	componentDidMount() {
		const block = document.getElementById( `block-${this.props.clientId}` );

		const mutationObserver = new MutationObserver( () => {
			this.initCountdown( block );
		} );

		mutationObserver.observe( block, {
			childList: true
		} );
	}

	render() {
		const {
			attributes: {
				fontGroupID,
				fontFamily,
				fontWeight,

				textAlignment,
			},
			setAttributes
		} = this.props;

		const changeState = this.changeState;

		const toolbarControls = [
			{
				icon: 'editor-alignleft',
				title: __('Left', 'getwid'),
				isActive: (textAlignment == 'left'),
				onClick: () => {
					setAttributes( { textAlignment: 'left' } );
				},
			},
			{
				icon: 'editor-aligncenter',
				title: __('Center', 'getwid'),
				isActive: (textAlignment == 'center'),
				onClick: () => {
					setAttributes( { textAlignment: 'center' } );
				},
			},
			{
				icon: 'editor-alignright',
				title: __('Right', 'getwid'),
				isActive: (textAlignment == 'right'),
				onClick: () => {
					setAttributes( { textAlignment: 'right' } );
				},
			},
			{
				icon: 'editor-justify',
				title: __('Justify', 'getwid'),
				isActive: (textAlignment == 'justify'),
				onClick: () => {
					setAttributes( { textAlignment: 'justify' } );
				},
			}
		];

		const shouldLoadGoogleFonts = !!fontFamily && ['', 'google-fonts'].includes(fontGroupID);

		return (
			<Fragment>
				{ (shouldLoadGoogleFonts) && (
					<GoogleFontLoader
						fonts={[ {
							font: fontFamily,
							weights: [fontWeight]
						} ]}
					/>
				)}
				<BlockControls>
					<ToolbarGroup
						controls={toolbarControls}
					/>
				</BlockControls>

				<Inspector
					{ ...{
						...this.props,
						changeState
					} }
				/>

				<ServerSideRender
					block="getwid/countdown"
					attributes={this.props.attributes}
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( { textColor: 'color' } ),
] )( Edit );
