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


const {compose} = wp.compose;
const { Component, Fragment } = wp.element;
const {
	ServerSideRender,
	Toolbar
} = wp.components;
const { BlockControls, AlignmentToolbar, withColors } = wp.blockEditor;


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
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[value];
	}

	initCountdown(isUpdate = false){
		const {
			clientId
		} = this.props;

		const thisBlock = $(`[data-block='${clientId}']`);

		this.waitLoadCountdown = setInterval( () => {

			let dataWrapper = $( `.${baseClass}__content:not('.init-countdown')`, thisBlock );
			if (dataWrapper.length){
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

				if (isUpdate){
					dataWrapper.countdown('destroy');
				}

				dataWrapper.countdown({
					until: dateTo,
					format: dateFormat,
					onTick: (e) =>{
						var section = jQuery('.countdown-section', dataWrapper);
						if (backgroundColor){
							section.css('background-color', backgroundColor);
						}
					}
				});

				clearInterval(this.waitLoadCountdown);
			}
		}, 1);

	}

	componentDidMount() {
		this.initCountdown(false);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(this.props.attributes, prevProps.attributes)){
			this.initCountdown(true);
		}
	}

	componentWillUnmount() {
		clearInterval(this.waitLoadCountdown);
	}

	render() {
		const {
			attributes: {
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

		return (
			<Fragment>
				{ fontFamily && (
					<GoogleFontLoader
						fonts={[ {
							font: fontFamily,
							weights: [fontWeight]
						} ]}
					/>
				)}
				<BlockControls>
					<Toolbar
						controls={toolbarControls}
					/>					
				</BlockControls>

				<Inspector {...{
					...this.props,
					changeState
				}} key='inspector'/>

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
