/**
* External dependencies
*/
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
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	AlignmentToolbar,
	BlockControls,
	withColors,
	RichText,
} = wp.blockEditor || wp.editor;
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

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
				}} key='inspector'/>
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
							allowedFormats={ [ 'bold', 'italic', 'strikethrough' ] }
							className={ classnames(
								{
									'has-text-color': textColor.color,
									[ textColor.class ]: textColor.class,
								}
							) }
							style={ {
								color: textColor.color,
							} }
							keepPlaceholderOnFocus
							allowedFormats={allowedFormats}
						/>
					</div>
				</div>

			</Fragment>
		);
	}
}

export default compose([
	withColors({ textColor: 'color' }),
])(Edit);
