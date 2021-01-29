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

const {jQuery: $} = window;

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
			googleFonts: null,
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
				this.setState({ googleFonts: data.items });
				if ( this.props.value ) {
					data.items.find( i => {
						if ( this.props.value === i.family ) {
							const variants = ( i.variants )
								.filter( o => false === o.includes( 'italic' ) )
								.map( o => {
									return o = {
										'label': ( toLower( o ) == 'regular' ? '400' : startCase( toLower( o ) ) ),
										'value': ( o == 'regular' ? 'normal' : o)
									};
								} );
							return this.setState({ variants });
						}
					} );
				}
			} );

		const items = wp.hooks.applyFilters(
			'getwid.custom-font-family.items',
			[
				{
					id:    'google-fonts',
					title: __( 'Google Fonts', 'getwid' ),
					items: this.state.googleFonts
				},
			]
		);

		return this.setState({ fonts: items });
	}

	render() {
		const id = `inspector-google-fonts-control-${ this.props.instanceId }`;

		return (
			<div className="components-getwid-google-fonts-control" >
				<BaseControl
					label={ this.props.label }
					id={ id }
				>
					{ ( null !== this.state.fonts ) ?
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
									<MenuGroup>
										<TextControl
											value={ this.state.search }
											onChange={ e => this.setState({ search: e }) }
										/>
										<div className="components-popover__items">
											<MenuItem
												onClick={ () => {
													onToggle();
													this.props.onChangeFontID( '' );
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
												const getID = i.id;

												return (
													<>
														{ ( ! this.state.search ) &&
															<h4 style={{margin:0}} >
																{ i.title }
															</h4>
														}
														{ ( i.items ).map( j => {
															if ( ! this.state.search || j.family.toLowerCase().includes( this.state.search.toLowerCase() ) ) {
																return (
																	<MenuItem
																		className={ classnames(
																			{ 'is-selected': ( j.family === this.props.value ) }
																		) }
																		onClick={ () => {
																			onToggle();
																			this.props.onChangeFontID( getID );
																			this.props.onChangeFontFamily( j.family );
																			this.props.onChangeFontWeight( 'normal' );

																			const variants = ( j.variants )
																				.filter( o => false === o.includes( 'italic' ) )
																				.map( o => {
																					return o = {
																						'label': ( toLower( o ) == 'regular' ? '400' : startCase( toLower( o ) ) ),
																						'value': ( o == 'regular' ? 'normal' : o)
																					};
																				});

																			this.setState({
																				font: j,
																				variants: variants[0] ? variants : 'normal',
																				search: ''
																			});
																		}}
																	>
																		{ j.family }
																	</MenuItem>
																);
															}
														} ) }
													</>
												);
											} ) }
										</div>
									</MenuGroup>
								) }
							/>
						) : (
						__( 'Loading…', 'getwid' )
					) }
				</BaseControl>
			</div>
		);
	}
}

export default withInstanceId( GoogleFontsControl );
