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
	RadioControl
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
				getDataFrom,
				userName,
				tagName,
				photoCount,
				displayStyle,
				gridColumns,
				linkTo,
				showLikes,
				showComments,
				align,
			},
			//Functions
			changeState,
			getState,
			manageInstagramToken,
			removeInstagramToken,
			
			setAttributes,
			className
		} = this.props;


		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>

					<RadioControl
						label={__('Display Instagram from', 'getwid')}
						selected={ getDataFrom }
						options={ [
							{value: 'self', label: __('My Account', 'getwid')},
							{value: 'username', label: __('Username', 'getwid')},
							{value: 'tagname', label: __('Tag', 'getwid')},
						] }
						onChange={getDataFrom => setAttributes({getDataFrom}) }
					/>

					{getDataFrom == 'username' && (
						<TextControl
							label={__('Instagram Username', 'getwid')}
							value={ userName }
							onChange={ value => setAttributes({userName: value}) }
						/>
					)}

					{getDataFrom == 'tagname' && (
						<TextControl
							label={__('Instagram #Tag', 'getwid')}
							value={ tagName }
							onChange={ value => setAttributes({tagName: value}) }
						/>
					)}

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

					<SelectControl
						label={__('Link to', 'getwid')}
						value={linkTo}
						onChange={linkTo => setAttributes({linkTo})}
						options={[
							{value: 'image', label: __('Image', 'getwid'), },
							{value: 'instagram', label: __('Instagram', 'getwid'), },
						]}
					/>

					<ToggleControl
						label={ __( 'Show Likes', 'getwid' ) }
						checked={ showLikes }
						onChange={ showLikes => {
							setAttributes({showLikes});
						} }
					/>

					<ToggleControl
						label={ __( 'Show Comments', 'getwid' ) }
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
										removeInstagramToken();
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
										removeInstagramToken();
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