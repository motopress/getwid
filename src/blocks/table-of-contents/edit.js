/**
* External dependencies
*/
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const { Component, Fragment } = wp.element;
const { select } = wp.data;
const { getBlockContent } = wp.blocks;
const { Placeholder, Button, ToolbarGroup, ToolbarButton } = wp.components;
const { BlockControls } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-table-of-contents';

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
		this.checkHeading = this.checkHeading.bind( this );
		this.findInnerHeading = this.findInnerHeading.bind( this );
	}

	componentDidMount() {
		this.checkHeading();
	};

	findInnerHeading( block, storeData )
	{
		const findInnerHeading = this.findInnerHeading;
		if ( block.name === 'core/columns' || block.name === 'core/column' || block.name === 'getwid/section' ) {
			block.innerBlocks.map(function ( el ) {
				findInnerHeading( el, storeData );
				return el;
			} )
		} else if ( block.name === 'core/heading' || block.name === 'getwid/advanced-heading' ) {
			storeData.push( block );
		}
		return storeData;
	}

	checkHeading() {
		let headingDatas = [];
		let headingBlocks = [];
		const allBlocks = select( 'core/block-editor' ).getBlocks();
		const findInnerHeading = this.findInnerHeading;
		const filteredBlocks = allBlocks.filter( ( block ) => ( block.name === 'core/heading' || block.name === 'getwid/advanced-heading' || block.name === 'core/columns' || block.name === 'getwid/section' ) );

		filteredBlocks.map(function ( block ) {
			if (block.name === 'core/columns' || block.name === 'getwid/section') {
				findInnerHeading( block, headingBlocks );
			} else {
				headingBlocks.push( block );
			}

			return block;
		});

		headingBlocks.map( ( heading ) => {
			let currentHeading = {};

			if (heading.name == 'core/heading'){
				currentHeading[ 'level' ] = parseInt( heading.attributes.level );
			} else if (heading.name == 'getwid/advanced-heading'){
				if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(heading.attributes.titleTag)){
					currentHeading[ 'level' ] = parseInt(heading.attributes.titleTag.replace("h", ""), 10);
				} else {
					return heading;
				}
			}

			if (currentHeading[ 'level' ]) {
				currentHeading[ 'level' ] -= 1;
				currentHeading[ 'content' ] = heading.attributes.content.length	? getBlockContent( heading ).replace( /<(?:.|\n)*?>/gm, '' ) : '';

				if (heading.attributes.anchor) {
					currentHeading[ 'anchor' ] = heading.attributes.anchor;
				} else {
					currentHeading[ 'anchor' ] = 'g' + heading.clientId.split('-')[heading.clientId.split('-').length - 1];
					heading.attributes.anchor = currentHeading[ 'anchor' ];
				}

				headingDatas.push( currentHeading );
			}

			return heading;
		} );

		this.props.setAttributes( {
			headings: headingDatas
		} );
	}

	render() {
		const {
			attributes: {
				headings,
				align,
				allowedTags,
				listStyle,
			}
		} = this.props;

		const moveChildren = (arr, item) => {
			if (arr.length === 0 || arr[0].level === item.level) {
				arr.push(Object.assign({}, item));
			} else if (arr[arr.length - 1].level < item.level) {
				if (!arr[arr.length - 1].children) {
					arr[arr.length - 1].children = [Object.assign({}, item)];
				} else moveChildren(arr[arr.length - 1].children, item);
			}
		};

		const getHeadingArr = headers => {
			let headingArr = [];

			headers
				.filter(header => allowedTags[header.level])
				.forEach(header => moveChildren(headingArr, header));

			return headingArr;
		};

		const getNode = (list) => list.map(item => (
			<li key={ item.anchor } >
				<a
					href={`#${item.anchor}`}
				>
					{item.content}
				</a>
				{item.children &&
				(listStyle === "ordered" ? (
					<ol>{getNode(item.children)}</ol>
				) : (
					<ul>
						{getNode(item.children)}
					</ul>
				))}
			</li>
		));

		let tableContent;

		if (headings.length > 0 && headings.filter(header => allowedTags[header.level]).length > 0) {

			tableContent = (
				<div
					className= {classnames(
						`${baseClass}`,
						`is-style-${listStyle}`,
						{
							[`align${align}`]: align != 'none',
						}
					)}
				>
					{listStyle === "ordered" ? (
						<ol
							className= {classnames(
								`${baseClass}__list`,
							)}
						>
							{ getNode( getHeadingArr( headings ) ) }
							</ol>
					) : (
						<ul
							className= {classnames(
								`${baseClass}__list`,
							)}
						>
							{ getNode( getHeadingArr( headings ) ) }
						</ul>
					)}
				</div>
			);
		} else {
			tableContent = (
				<Placeholder
					icon={<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7"></path></g></svg>}
					label={__('Table of Contents', 'getwid')}
					instructions={__( 'Headings not found on this page.', 'getwid' )}
				>
					<Button
						onClick={ this.checkHeading }
						isSecondary
					>
						{ __( 'Update', 'getwid' ) }
					</Button>
				</Placeholder>
			);
		}

		return (
			<Fragment>
				{ !!headings.length && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon={ 'update' }
								label={ __( 'Update', 'getwid' ) }
								onClick={ this.checkHeading }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }
				<Inspector {...this.props} />
				{tableContent}
			</Fragment>
		);
	}
}

export default (Edit);
