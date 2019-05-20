/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

import { __ } from 'wp.i18n';

const { withInstanceId } = wp.compose;

const {
	Button,
	BaseControl,
	Dropdown,
	MenuGroup,
	MenuItem,
	SelectControl,
	TextControl
} = wp.components;

const { Component } = wp.element;

/**
* Internal dependencies
*/
import './editor.scss';

class GoogleFontsControl extends Component {
	constructor() {
		super( ...arguments );
		this.search = React.createRef();

		this.state = {
			fonts: null,
			font: [],
			variants: null,
			search: ''
		};
	}

	async componentDidMount() {
		await fetch( 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAWN8pd8HMruaR92oVbykdg-Q2HpgsikKU' )
			.then( blob => blob.json() )
			.then( data => {
				this.setState({ fonts: data.items });
				if ( this.props.value ) {
					data.items.find( i => {
						if ( this.props.value === i.family ) {
							const variants = ( i.variants )
								.filter( o => false === o.includes( 'italic' ) )
								.map( o => {
									return o = {
										'label': startCase( toLower( o ) ),
										'value': o
									};
								});
							return this.setState({ variants });
						}
					});
				}
			});
	}

	render() {
		const id = `inspector-google-fonts-control-${ this.props.instanceId }`;
		return (
			<div className="components-getwid-google-fonts-control" >
				<BaseControl
					label={ this.props.label }
					id={ id }
				>
					{( null !== this.state.fonts ) ?
						(
							<Dropdown
								contentClassName="components-getwid-google-fonts-popover"
								position="bottom center"
								renderToggle={ ({ isOpen, onToggle }) => (
									<Button
										isLarge
										className="components-getwid-google-fonts-button"
										id={ id }
										onClick={ onToggle }
										aria-expanded={ isOpen }
									>
										{ this.props.value ? this.props.value : __( 'Select Font Family', 'getwid' ) }
									</Button>
								) }
								renderContent={ ({ onToggle }) => (
									<MenuGroup label={ __( 'Google Fonts', 'getwid' ) }>
										<TextControl
											value={ this.state.search }
											onChange={ e => this.setState({ search: e }) }
										/>

										<div className="components-popover__items">
											<MenuItem
												onClick={ () => {
													onToggle();
													this.props.onChangeFontFamily( '' );
													this.props.onChangeFontWeight( '' );
													this.setState({
														font: [],
														variants: null,
														search: ''
													});
												}}
											>
												{ __( 'Default', 'getwid' ) }
											</MenuItem>
											{ ( this.state.fonts ).map( i => {
												if ( ! this.state.search || i.family.toLowerCase().includes( this.state.search.toLowerCase() ) ) {
													return (
														<MenuItem
															className={ classnames(
																{ 'is-selected': ( i.family === this.props.value ) }
															)}
															onClick={ () => {
																onToggle();
																this.props.onChangeFontFamily( i.family );
																this.props.onChangeFontWeight( 'normal' );

																const variants = ( i.variants )
																	.filter( o => false === o.includes( 'italic' ) )
																	.map( o => {
																		return o = {
																			'label': (toLower( o ) == 'regular' ? '400' : startCase( toLower( o ) ) ),
																			'value': ( o == 'regular' ? 'normal' : o)
																		};
																	});

																this.setState({
																	font: i,
																	variants,
																	search: ''
																});
															}}
														>
															{ i.family }
														</MenuItem>
													);
												}
											})}
										</div>
									</MenuGroup>
								) }
							/>
						) : (
						__( 'Loading…', 'getwid' )
					)}
				</BaseControl>

				<SelectControl
					label={ __( 'Font Weight', 'getwid' ) }
					value={ this.props.valueWeight || '' }
					options={ this.state.variants ? this.state.variants : [
						{value: '', label: __('Default', 'getwid')},
						{value: '100', label: __('100', 'getwid')},
						{value: '200', label: __('200', 'getwid')},
						{value: '300', label: __('300', 'getwid')},
						{value: 'normal', label: __('400', 'getwid')},
						{value: '500', label: __('500', 'getwid')},
						{value: '600', label: __('600', 'getwid')},
						{value: '700', label: __('700', 'getwid')},
						{value: '800', label: __('800', 'getwid')},
						{value: '900', label: __('900', 'getwid')},
					] }
					onChange={ this.props.onChangeFontWeight }
				/>

			</div>
		);
	}
}

export default withInstanceId( GoogleFontsControl );
