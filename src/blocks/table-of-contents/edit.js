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
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {select, dispatch} = wp.data;
const {registerBlockType, getBlockContent, createBlock} = wp.blocks;
const {IconButton, Placeholder, Button, Toolbar} = wp.components;
const {BlockControls, AlignmentToolbar, RichText} = wp.blockEditor || wp.editor;

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
	}

	componentDidMount() {
		this.checkHeading();
	};

	static findInnerHeading( block, storeData )
	{
		if ( block.name === 'core/columns' || block.name === 'core/column' ) {
			block.innerBlocks.map(function ( el ) {
				tableOfContent.findInnerHeading( el, storeData );
				return el;
			} )
		} else if ( block.name === 'core/heading' ) {
			storeData.push( block );
		}
		return storeData;
	}

	checkHeading() {
		let headingDatas = [];
		let headingBlocks = [];
		const allBlocks = select( 'core/editor' ).getBlocks();
		const filteredBlocks = allBlocks.filter( ( block ) => ( block.name === 'core/heading' || block.name === 'core/columns' ) );
		filteredBlocks.map(function ( block ) {
			if (block.name === 'core/columns') {
				tableOfContent.findInnerHeading( block, headingBlocks );
			} else {
				headingBlocks.push( block );
			}

			return block;
		});

		headingBlocks.map( ( heading ) => {
			let currentHeading = {};
			currentHeading[ 'level' ] = parseInt( heading.attributes.level );

			if (currentHeading[ 'level' ] > 1) {
				currentHeading[ 'level' ] -= 1;
				currentHeading[ 'content' ] = heading.attributes.content.length	? getBlockContent( heading ).replace( /<(?:.|\n)*?>/gm, '' ) : '';
				let lowerCaseText = unescape(currentHeading[ 'content' ].toLowerCase());
				let headingID = lowerCaseText.replace(/[!@#$%^&*()\/\\,?":{}|<>]/g, "");
				headingID = headingID.replace(/(amp;)+/g, "");
				headingID = headingID.replace(/\s/g, "-");
				headingID = headingID + '-' + heading.clientId;

				currentHeading[ 'clientId' ] = heading.clientId;
				if (heading.attributes.anchor) {
					currentHeading[ 'anchor' ] = heading.attributes.anchor;
				} else {
					currentHeading[ 'anchor' ] = headingID;
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
				title,
				listStyle,
				titleAlignment
			},
			isSelected,
			setAttributes,
		} = this.props;

		const { selectBlock } = dispatch( 'core/editor' );

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
				.filter(header => allowedTags[header.level - 1])
				.forEach(header => moveChildren(headingArr, header));

			return headingArr;
		};

		const getNode = (list) => list.map(item => (
			<li>
				<a
					href={`#${item.anchor}`}
					onClick={() => selectBlock( item.clientId )}
				>
					{item.content}
				</a>
				{item.children &&
				(listStyle === "numbered" ? (
					<ol
						className= {classnames(
							`${baseClass}__inner-list`,
						)}
					>{getNode(item.children)}</ol>
				) : (
					<ul
						className= {classnames(
							`${baseClass}__inner-list`,
						)}
					>
						{getNode(item.children)}
					</ul>
				))}
			</li>
		));

		let tableContent;

		if (headings.length > 0 && headings.filter(header => allowedTags[header.level - 1]).length > 0) {
			const { selectBlock } = dispatch( 'core/editor' );
			tableContent = (
				<div
					className= {classnames(
						`${baseClass}`,
						{
							[`align${align}`]: align != 'none',
							[`title-${titleAlignment}`]: undefined !== titleAlignment,
						}
					)}
				>
					<div
						className= {classnames(
							`${baseClass}__title`,
						)}
					>
						<RichText
							tagName='p'
							placeholder={__("Custom Title")}
							onChange={value => setAttributes({title: value})}
							value={title}
							keepPlaceholderOnFocus={true}
						/>
					</div>

					{listStyle === "numbered" ? (
						<ol
							className= {classnames(
								`${baseClass}__list`,
								`list-style-${listStyle}`
							)}
						>{getNode(getHeadingArr(headings))}</ol>
					) : (
						<ul
							className= {classnames(
								`${baseClass}__list`,
								`list-style-${listStyle}`
							)}
						>
							{getNode(getHeadingArr(headings))}
						</ul>
					)}
				</div>
			);
		} else {
			tableContent = (
				<Placeholder
					icon={<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7"></path></g></svg>}
					label={__('Table of contents', 'getwid')}
					instructions={__( 'Headings not found on this page.', 'getwid' )}
				>
					<Button
						onClick={this.checkHeading}
						className={'button'}
					>
						{__( 'Check Headings', 'getwid' )}
					</Button>
				</Placeholder>
			);
		}

		return (
			<Fragment>
				{!!headings.length && (
					<BlockControls>
						<AlignmentToolbar
							value={ titleAlignment }
							onChange={ titleAlignment => setAttributes({titleAlignment}) }
						/>
						<Toolbar>
							<IconButton
								className={'components-icon-button components-toolbar__control'}
								icon={'update'}
								label={__( 'Update Headings', 'getwid' )}
								onClick={this.checkHeading}
							/>
						</Toolbar>

					</BlockControls>
				) }
				<Inspector {...this.props} />
				{tableContent}
			</Fragment>
		);
	}
}

export default (Edit);
