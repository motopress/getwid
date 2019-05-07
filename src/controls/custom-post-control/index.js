/**
 * External dependencies
 */
import classnames from 'classnames';
import { isUndefined, pickBy, isEqual } from 'lodash';


/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

import { __ } from 'wp.i18n';

const {
	// withInstanceId,
	compose } = wp.compose;

const apiFetch = wp.apiFetch;

const {
	addQueryArgs
} = wp.url;

const {
	withSelect,
} = wp.data;


const POST_TYPES_LIST_QUERY = {
	per_page: -1,
	// context: 'edit'
};




// const { compose } = wp.compose;

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

class CustomPostsControl extends Component {
	constructor() {
		super( ...arguments );
		this.search = React.createRef();

		this.state = {
			postTypeList: [],
			fonts: null,
			font: [],
			variants: null,
			search: ''
		};
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/types` ),
			// path: addQueryArgs( `/wp/v2/types`, POST_TYPES_LIST_QUERY ),
		} ).then(
			( postTypeList ) => {
				if ( this.isStillMounted ) {
					this.setState( { postTypeList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { postTypeList: [] } );
				}
			}
		);
	}

	componentWillUnmount() {
		this.isStillMounted = false;
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
		const {
			recentPosts,
		} = this.props;

		console.warn(this.state.postTypeList);

		console.log(recentPosts);
		
		// return ('control');
		const id = `inspector-google-fonts-control`;
		// const id = `inspector-google-fonts-control-${ /* this.props.instanceId */ }`;
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
													this.setState({
														font: [],
														variants: [],
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
																			'label': (toLower( o ) == 'regular' ? 'Normal' : startCase( toLower( o ) ) ),
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

				{ this.state.variants && (
					<SelectControl
						label={ __( 'Font Weight', 'getwid' ) }
						value={ this.props.valueWeight || 'normal' }
						options={ this.state.variants }
						onChange={ this.props.onChangeFontWeight }
					/>
				)}

			</div>
		);
	}
}

// export default withInstanceId( CustomPostsControl );
export default compose([
	withSelect( ( select, props ) => {
		// const { postsToShow, order, orderBy, categories } = props.attributes;
		const { getEntityRecords, getMedia } = select( 'core' );
		const postsQuery = pickBy( {
			categories: '',
			// categories,
			order: 'desc',
			// order,
			orderby: 'date',
			// orderby: orderBy,
			per_page: 5,
			// per_page: postsToShow,
		}, ( value ) => ! isUndefined( value ) );
	

		//recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
		return {
			recentPosts: getEntityRecords( 'postType' ),
		};
	} ),
/* 	withInstanceId(()=>{
		return 'custom-post-type';
	}), */
])(CustomPostsControl);