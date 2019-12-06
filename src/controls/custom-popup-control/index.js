/**
 * External dependencies
 */
import './editor.scss';
import classnames from "classnames";


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	BaseControl,
	Popover,
	Button,
	Dashicon
} = wp.components;

const { Component, Fragment } = wp.element;


/**
* Create an Control
*/
class GetwidCustomPopUpControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isVisible: false,
		};
	}

	render() {
		const {
			isVisible
		} = this.state;

		const {
			renderPopUp,
			label,
			icon
		} = this.props;

		return (
			<Fragment>
				<BaseControl
					label={label}
					className="components-getwid-popup-control"
				>
					<Button
						className={ classnames(
							'wp-block-getwid-popup-icon',
						) }		
						isPrimary={isVisible ? true : undefined}
						isDefault={!isVisible ? true : undefined}										
						onClick={ (e) => {
							this.setState({isVisible: !isVisible})
						}}>
						<Dashicon icon={icon}/>			

						{ isVisible && (
							<Popover
								onClick={ (e) => {
									e.stopPropagation();							
								}}
								className='components-getwid-popup-wrapper'
								focusOnMount='container'
								position="top center"
							>
								{renderPopUp}
							</Popover>
						) }
					</Button>
				</BaseControl>
			</Fragment>
		);
	}
}

export default ( GetwidCustomPopUpControl );