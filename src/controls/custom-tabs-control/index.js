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
		tabs = ['general','style','layout','advanced']
	} ) {

	return (
		<Fragment>
			<PanelBody className="components-getwid-tabs-control">
				{ tabs.includes('general') && (
					<Fragment>
						<Button
							className={ classnames(
								'components-getwid-tab',
								{ 'is-selected': 'general' === state }
							) }
							onClick={ () => {
								onChangeTab(stateName, 'general');
							}}
						>
							<span
							>
								<Dashicon icon="admin-settings"/>
								{ __( 'General', 'getwid' ) }
							</span>
						</Button>
					</Fragment>
				)}

				{ tabs.includes('style') && (
					<Fragment>
						<Button
							className={ classnames(
								'components-getwid-tab',
								{ 'is-selected': 'style' === state }
							) }
							onClick={ () => {
								onChangeTab(stateName, 'style');
							}}
						>
							<span
							>
								<Dashicon icon="admin-appearance"/>
								{ __( 'Style', 'getwid' ) }
							</span>
						</Button>
					</Fragment>
				)}

				{ tabs.includes('layout') && (
					<Fragment>
					<Button
						className={ classnames(
							'components-getwid-tab',
							{ 'is-selected': 'layout' === state }
						) }
						onClick={ () => {
							onChangeTab(stateName, 'layout');
						}}
					>
						<span
						>
							<Dashicon icon="layout"/>
							{ __( 'Layout', 'getwid' ) }
						</span>
					</Button>
				</Fragment>
				)}

				{ tabs.includes('advanced') && (
					<Fragment>
						<Button
							className={ classnames(
								'components-getwid-tab',
								{ 'is-selected': 'advanced' === state }
							) }
							onClick={ () => {
								onChangeTab(stateName, 'advanced');
							}}
						>
							<span
							>
								<Dashicon icon="admin-generic"/>
								{ __( 'Advanced', 'getwid' ) }
							</span>
						</Button>
					</Fragment>
				)}
			</PanelBody>
		</Fragment>
	);
}
