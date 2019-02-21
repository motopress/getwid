import classnames from 'classnames';
import memize from 'memize';
import Inspector from './inspector';
import {
	times,
	map,
	merge,
	isEqual
} from "lodash";

import './editor.scss';

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;

const { compose } = wp.compose;

const {
	withSelect,
	dispatch
} = wp.data;

const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
} = wp.components;

const { __, sprintf } = wp.i18n;

const minHeight = 24;

class Edit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);

		this.state = {
			aztecHeight: 0,
		};
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	componentDidMount() {
		
	}

	componentDidUpdate(prevProps, prevState) {
		
	}

	render() {
		const {
			attributes:
			{
				content,
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				titleTag,
				fontFamily,
				fontSize,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing,
				align,
				textAlignment,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				textAnimation,
				textAnimationDuration,
				textAnimationDelay,
			},
			className,
			setAttributes,
			mergeBlocks,
			insertBlocksAfter
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const wrapperClass = classnames(className, {
			'alignfull': align === 'full',
			'alignwide': align === 'wide'
		});

		return (
			<Fragment>
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( value ) => {
							setAttributes( { textAlignment: value } );
						}}
					/>	
				</BlockControls>

				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState}
				}} key='inspector'/>

				<div className={ wrapperClass }>

					<RichText
						tagName={ titleTag }
						value={ content }
						isSelected={ this.props.isSelected }
						onFocus={ this.props.onFocus } // always assign onFocus as a props
						onBlur={ this.props.onBlur } // always assign onBlur as a props
						onCaretVerticalPositionChange={ this.props.onCaretVerticalPositionChange }
						style={{
							minHeight: Math.max( minHeight, this.state.aztecHeight ),
						}}
						onChange={ ( value ) => setAttributes( { content: value } ) }
						onMerge={ mergeBlocks }
						onSplit={
							insertBlocksAfter ?
								( before, after, ...blocks ) => {
									setAttributes( { content: before } );
									insertBlocksAfter( [
										...blocks,
										createBlock( 'core/paragraph', { content: after } ),
									] );
								} :
								undefined
						}
						onContentSizeChange={ ( event ) => {
							this.setState( { aztecHeight: event.aztecHeight } );
						} }
						placeholder={ __( 'Write heading…', 'getwid' ) }
					/>

				</div>
			</Fragment>
		);
	}
}

export default ( Edit );