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
	ServerSideRender,
	Disabled
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

	render() {
		const {
			attributes: {
				imageSize,
				titleTag,
				showContent,
				showTitle,
				showDate,
				showCategories,
				showCommentsCount,
				showFeaturedImage,
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

		const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
						...{changeState},
						...{getState},
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

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState},
					...{hasPosts},
				}} key='inspector'/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= {[ 'wide', 'full' ]}
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>

				<Disabled>
					<ServerSideRender
						block="getwid/recent-posts"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords, getMedia } = select( 'core' );
	const postsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );