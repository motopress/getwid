/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';
import classnames from 'classnames';
import Inspector from './inspector';
import './editor.scss';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	Spinner,
	ToggleControl,
	Toolbar,
} = wp.components;

const apiFetch = wp.apiFetch;

const {
	addQueryArgs
} = wp.url;

const { __, sprintf } = wp.i18n;

const {
	dateI18n,
	format,
	__experimentalGetSettings
} = wp.date;

const {
	decodeEntities
} = wp.htmlEntities;

const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;

const {
	withSelect,
	dispatch
} = wp.data;

/**
 * Module Constants
 */
const CATEGORIES_LIST_QUERY = {
	per_page: -1,
};

class Edit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			categoriesList: [],
		};

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);		
		this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/categories`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( categoriesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } );
				}
			}
		);
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
	}

	render() {
		const {
			attributes: {
				displayPostDate,
				align,
				postLayout,
				columns,
				order,
				orderBy,
				categories,
				postsToShow,
			},
			setAttributes,
			recentPosts,
			className
		} = this.props;

		const { categoriesList } = this.state;

		const changeState = this.changeState;
		const getState = this.getState;
		const toggleDisplayPostDate = this.toggleDisplayPostDate;

		const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
						...{changeState},
						...{getState},
						...{toggleDisplayPostDate},
						...{hasPosts},
					}} key='inspector'/>
					<Placeholder
						icon="admin-post"
						label={ __( 'Recent Posts', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'getwid' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = recentPosts.length > postsToShow ?	recentPosts.slice( 0, postsToShow ) : recentPosts;

		const layoutControls = [
			{
				icon: 'list-view',
				title: __( 'List View', 'getwid' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid View', 'getwid' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
		];

		const dateFormat = __experimentalGetSettings().formats.date;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState},
					...{toggleDisplayPostDate},
					...{hasPosts},
				}} key='inspector'/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<ul
					className={ classnames( className, {
						'is-grid': postLayout === 'grid',
						'has-dates': displayPostDate,
						[ `columns-${ columns }` ]: postLayout === 'grid',
					} ) }
				>
					{ displayPosts.map( ( post, i ) =>
						<li key={ i }>
							<a href={ post.link } target="_blank">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'getwid' ) }</a>
							{ displayPostDate && post.date_gmt &&
								<time dateTime={ format( 'c', post.date_gmt ) } className="wp-block-getwid-recent-posts__post-date">
									{ dateI18n( dateFormat, post.date_gmt ) }
								</time>
							}
						</li>
					) }
				</ul>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const recentPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	return {
		recentPosts: getEntityRecords( 'postType', 'post', recentPostsQuery ),
	};
} )( Edit );