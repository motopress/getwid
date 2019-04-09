/**
* External dependencies
*/
import { times, escape, unescape} from 'lodash';
import FocusPanelBody from 'GetwidControls/focus-panel-body';


/**
* WordPress dependencies
*/
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Modal,
	TextControl,
	TextareaControl,
	ExternalLink,
	RadioControl,
	Notice
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	render() {
		const {
			attributes: {
				photoCount,
				displayStyle,
				gridColumns,
				showLikes,
				showComments,
			},
			//Functions
			changeState,
			getState,
			manageInstagramToken,
			
			setAttributes,
			className
		} = this.props;

		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>

					<RangeControl
						label={__('Photo to show', 'getwid')}
						value={photoCount}
						onChange={photoCount => {
							if (typeof photoCount == 'undefined'){
								photoCount = 10;
							}
							setAttributes({photoCount});
						}}
						allowReset
						min={1}
						max={100}
						step={1}
					/>

					<SelectControl
						label={__('Display style', 'getwid')}
						value={displayStyle}
						onChange={displayStyle => setAttributes({displayStyle})}
						options={[
							{value: 'grid', label: __('Grid', 'getwid'), },
							{value: 'carousel', label: __('Carousel', 'getwid'), },
						]}
					/>

					{displayStyle == 'grid' && (
						<RangeControl
							label={__('Grid Columns', 'getwid')}
							value={gridColumns}
							onChange={gridColumns => {
								if (typeof gridColumns == 'undefined'){
									gridColumns = 3;
								}
								setAttributes({gridColumns});
							}}
							allowReset
							min={1}
							max={6}
							step={1}
						/>
					)}

					<ToggleControl
						label={ __( 'Show Likes Count', 'getwid' ) }
						checked={ showLikes }
						onChange={ showLikes => {
							setAttributes({showLikes});
						} }
					/>

					<ToggleControl
						label={ __( 'Show Comments Count', 'getwid' ) }
						checked={ showComments }
						onChange={ showComments => {
							setAttributes({showComments});
						} }
					/>				

				</PanelBody>

				<PanelBody title={ __( 'Instagram Access token', 'getwid' ) } initialOpen={false}>

						<TextControl
							label={__('Instagram Access token', 'getwid')}
							value={ getState('checkToken') }
							onChange={ value => changeState('checkToken', value) }
						/>
						<BaseControl>
							<ButtonGroup>
								<Button
								isPrimary
								disabled={((getState('checkToken') != '') ? null : true)}
								onClick={ 
									(event) => {
										manageInstagramToken(event, 'set');
									}
								}>
									{ __( 'Update', 'getwid' ) }
								</Button>

								<Button isDefault onClick={
									(event) => {
										changeState('checkToken', '');
										changeState('instagramToken', '');
										manageInstagramToken(event, 'delete');
									}
								}>
									{ __( 'Delete', 'getwid' ) }
								</Button>
							</ButtonGroup>
						</BaseControl>
						<BaseControl>
							<ExternalLink href="https://www.instagram.com/developer/authentication/">{__('Get your key.', 'getwid')}</ExternalLink>
						</BaseControl>

				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );