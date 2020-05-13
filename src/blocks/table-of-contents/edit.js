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
const {BlockControls} = wp.blockEditor || wp.editor;

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
				allowedTags
			},
			isSelected,
			setAttributes,
		} = this.props;

		let tableContent;

		if (headings.length > 0) {
			const { selectBlock } = dispatch( 'core/editor' );
			tableContent = (
				<ul
					className= {classnames(
						`${baseClass}`,
						{
							[`align${align}`]: align != 'none',
						}

					)}
				>
					{headings.map( ( heading ) => {
						return (
							<li className={'content-level-' + heading.level}
								style={{
									marginLeft: heading.level * 20,
									display: (allowedTags[heading.level - 1] == false ? 'none' : undefined)
								}}
								key={heading.anchor}
							>
								<a href={'#' + heading.anchor}
									onClick={() => selectBlock( heading.clientId )}
								>
									{heading.content}
								</a>
							</li>
						)
					} )}
				</ul>
			)
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
