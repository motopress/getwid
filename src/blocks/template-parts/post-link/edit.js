/**
* External dependencies
*/
import classnames from 'classnames';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const { serverSideRender: ServerSideRender } = wp;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Disabled,
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	AlignmentToolbar,
	BlockControls,
	withColors,
	RichText,
} = wp.blockEditor || wp.editor;
const {
	select,
} = wp.data;
const { compose } = wp.compose;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	render() {
		const {
			attributes: {
				textAlignment,
				buttonText
			},
			textColor,

			setAttributes,
			className
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector { ...this.props } />
					<BlockControls>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>
					</BlockControls>

					<div
						className={ classnames(
							className
						)}
						style={{
							textAlign: textAlignment
						}}
					>
						<div
							ref={ this.bindRef }>

							<RichText
								placeholder={ __('Read More', 'getwid') }
								value={ buttonText }
								onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								className={ classnames(
									{
										'has-text-color': textColor.color,
										[ textColor.class ]: textColor.class,
									}
								) }
								style={ {
									color: textColor.color,
								} }
								allowedFormats={allowedFormats}
							/>
						</div>
					</div>

				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-link"
							attributes={this.props.attributes}
						/>
					</Disabled>
				</Fragment>
			);
		}

	}
}

export default compose([
	withColors({ textColor: 'color' }),
])(Edit);
