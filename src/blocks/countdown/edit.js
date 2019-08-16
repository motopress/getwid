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


const {compose} = wp.compose;
const { Component, Fragment } = wp.element;
const {
	ServerSideRender,
} = wp.components;
const { BlockControls, AlignmentToolbar, withColors } = wp.editor;


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
			attributes: {
				backgroundColor
			},
			clientId
		} = this.props;

		const thisBlock = $(`[data-block='${clientId}']`);

		this.waitLoadCountdown = setInterval( () => {

			let dataWrapper = $( `.${baseClass}__wrapper:not('.init-countdown')`, thisBlock );
			if (dataWrapper.length){
				dataWrapper.addClass('init-countdown');

				var {
					dateTime,
					year,
					months,
					weeks,
					days,
					hours,
					minutes,
					seconds,
				} = dataWrapper.data('countdown-option');

				var default_date = new Date(Getwid.settings.date_time_utc);
				default_date.setDate(default_date.getDate() + 1);
		
				var dateTo = dateTime != '' ? (dateTime == 'negative' ? '' : dateTime) : default_date;
				var dateFormat = '';
		
				if (year){
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
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ value => {
							setAttributes( { textAlignment: value } );
						}}
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