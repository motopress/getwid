/**
* External dependencies
*/
import { isUndefined, pickBy } from 'lodash';
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
	Placeholder,
	Spinner,
	ServerSideRender,
	Disabled,
	Toolbar
} = wp.components;
import { __ } from 'wp.i18n';
const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;
const {
	withSelect,
} = wp.data;


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);		
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	render() {
		const {
			attributes: {
				align,
				postLayout
			},
			setAttributes,
			recentPosts,
			className
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Placeholder
						icon="admin-post"
						label={ __( 'Custom Post Type', 'getwid' ) }
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
					<Toolbar
						controls={ [
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
						] }
					/>
				</BlockControls>

				<Disabled>
					<ServerSideRender
						block="getwid/custom-post-type"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );