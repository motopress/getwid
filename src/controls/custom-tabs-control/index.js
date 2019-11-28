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
	Dashicon,
	Button,
	PanelBody
} = wp.components;
const { Fragment } = wp.element;


export default function GetwidCustomTabsControl (
	{
		state,
		stateName,
		onChangeTab,
	} ) {

		console.log(state);
		console.log(stateName);
		console.log(onChangeTab);

	return (
		<Fragment>
			<PanelBody className="wp-block-getwid-header-panel">
				<Button
					className={ classnames(
						'wp-block-getwid-header-tab',
						{ 'is-selected': 'general' === state }
					) }
					onClick={ () => {
						// debugger;
						onChangeTab(stateName, 'general');
					}}
				>
					<span
					>
						<Dashicon icon="admin-settings"/>
						{ __( 'General', 'getwid' ) }
					</span>
				</Button>

				<Button
					className={ classnames(
						'wp-block-getwid-header-tab',
						{ 'is-selected': 'style' === state }
					) }
					onClick={ () => {
						// debugger;
						onChangeTab(stateName, 'style');
					}}
				>
					<span
					>
						<Dashicon icon="admin-appearance"/>
						{ __( 'Style', 'getwid' ) }
					</span>
				</Button>

				<Button
					className={ classnames(
						'wp-block-getwid-header-tab',
						{ 'is-selected': 'advanced' === state }
					) }
					onClick={ () => {
						// debugger;
						onChangeTab(stateName, 'advanced');
					}}
				>
					<span
					>
						<Dashicon icon="admin-generic"/>
						{ __( 'Advanced', 'getwid' ) }
					</span>
				</Button>
			</PanelBody>
		</Fragment>
	);
}
