/**
* External dependencies
*/
import classnames from 'classnames';
import './editor.scss';
import Inspector from './inspector';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	Dashicon,
	Spinner,
	SelectControl,
	TextControl,
	Modal,
	TabPanel
} = wp.components;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
import { __ } from 'wp.i18n';
const {
	select,
	dispatch,
	withSelect,
} = wp.data;
const {
	parse,
} = wp.blocks;


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );	

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);	
		
		this.state = {
			pageTemplates: [],
			pageCategories: [],
			categoryFilter: '',
			titleFilter: '',
			showLoadTemplates: true,
			needToUpdate: false,
			showModal: false,
			templateView: 'grid',
		};		
	}

	changeState (param, value) {
		if (typeof param == 'object'){
			this.setState(param);
		} else if (typeof param == 'string'){
			this.setState({[param]: value});
		}
	}

	getState (value) {
		return this.state[value];
	}

	getData(cacheRequest = 'cache') {	   
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/getwid/v1/get_remote_templates`, {
				cache: cacheRequest
			} ),
		} ).then(
			( remoteData ) => {
				console.log( remoteData );
				debugger;

				//Server valiable (data.status != 404)
				if (typeof remoteData.data == 'undefined'){
					if ( this.isStillMounted && remoteData instanceof Object ) {
						this.setState( {
							pageCategories : remoteData.categories,
							pageTemplates : remoteData.templates,
							showLoadTemplates : false
						} );
					} else {
						this.setState( {
							pageCategories: null,
							pageTemplates: null,
							showLoadTemplates : false
						} );
					}
				}
			}
		).catch(
			(remoteData) => {
				if ( this.isStillMounted ) {
					this.setState( {
						pageCategories: [],
						pageTemplates: []
					} );
				}
			}
		);		
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.getData();
	}

	componentDidUpdate(prevProps, prevState) {
		const changeState = this.changeState;

		const {
			needToUpdate,
		} = this.state;

		if (needToUpdate) {
			changeState({
				needToUpdate: false
			});			
		}
	}

	render() {
		const {
			className,
		} = this.props;

		const {
			categoryFilter,
			showLoadTemplates,
			pageTemplates,
			pageCategories,
			templateView,
			titleFilter
		} = this.state;	

		const changeState = this.changeState;
		const getState = this.getState;

		const clientId = select('core/editor').getSelectedBlockClientId();

		const render_item = (type) => {		
			let pageTemplatesArr = pageTemplates[type];

			//Category filter
			if (categoryFilter !=''){
				pageTemplatesArr = pageTemplatesArr.filter((key, index) => {
					let found = false;

					key.categories.forEach(function(el) {
						if (el.value == categoryFilter){
							found = true;
						}
					});

					return found;
				});
			}

			//Title filter
			if (titleFilter !=''){
				pageTemplatesArr = pageTemplatesArr.filter((key, index) => {
					if (key.title.indexOf(titleFilter) !== -1){
						return true
					} else {
						return false;
					}
				});
			}		

			if (typeof pageTemplatesArr != 'undefined'){
				if (pageTemplatesArr.length){
					return pageTemplatesArr.map((key, index) => {
	
						let categoriesArr = [];
						if (key.categories.length){
							key.categories.forEach(function(el) {
								categoriesArr.push(el.label)
							});
						}
		
						return (
							<div className="template-library-item">
								<Button
									className="components-button components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"
									key={index}
									onClick={
										(e) => {
											const blocks = parse(key.content);
											dispatch('core/editor').replaceBlocks(clientId, blocks);
										}
									}
								>
									<div className="template-image-wrapper">
										<div className="template-image" style={{ backgroundImage: `url('${key.image}')` }}></div>
									</div>
									<div className="template-content-wrapper">
										<div className="template-title">{key.title}</div>
										<div className="template-categories"> {categoriesArr.join(', ')}</div>
										{key.description != '' && (
											<div className="template-description"> {key.description}</div>
										)}
									</div>
								</Button>
							</div>																
						);
					});
				} else {
					return (__( 'Not Found Templates', 'getwid' ));
				}
			}
		};

		const renderCategoriesSelect = (type) => {
			let pageCategoriesArr = [];
	
			//Fill select
			for (let key in pageCategories[type]) {
				let obj = {};

				obj['value'] = key;
				obj['label'] = pageCategories[type][key];
				pageCategoriesArr.push(obj)
			}

			return (
				<Fragment>
					{pageCategoriesArr.length ? (
						<SelectControl							
							label={ __( 'Page Categories', 'getwid' ) }
							autoFocus={ false }
							value={ categoryFilter ? categoryFilter : '' }
							onChange={ (value) => {
								changeState({
									categoryFilter: value,
								});
							} }
							options={[
								...[{'value': '', 'label': 'All' }],
								...(pageCategoriesArr ? pageCategoriesArr : [])
							]}
						/>					
					) : null}
				</Fragment>
			);
		};

		const renderSearchField = () => {
			return (
				<Fragment>				
					<TextControl
						className={'template-search-field'}
						label={__('Template name', 'getwid')}
						value={ titleFilter ? titleFilter : '' }
						onChange={ value => {
							changeState({
								titleFilter: value,
							});
						} }
					/>	
					<ButtonGroup
						className={'template-search-group'}
					>
						<Button
							className={'template-search-button'}
							isPrimary
							onClick={ () => {
								changeState({
									needToUpdate: true
								});
							}}
						>
							{ __( 'Search', 'getwid' ) }
						</Button>
						<Button
							className={'template-search-button'}
							isDefault
							onClick={ () => {
								this.setState( { showLoadTemplates : true } );
								this.getData('refresh');
							}}
						>
							{ __( 'Update Templates (Refresh cache)', 'getwid' ) }
						</Button>							
					</ButtonGroup>
				</Fragment>
			);
		};

		const tabContent = (type) => (
			<Fragment>
				<div
					className={`${className}__wrapper`}
				>
					{renderCategoriesSelect(type)}
					{renderSearchField()}

					<div className={
						classnames(
							'template-library-list',
							`view-${templateView}`,
							{
								['loading-items'] : showLoadTemplates || ( pageTemplates ? Object.entries( pageTemplates ).length == 0 : null )
							}
						)
					}>
						{( ( pageTemplates ? Object.entries( pageTemplates ).length == 0 : null ) && showLoadTemplates == false) && (__( 'Not Found Templates', 'getwid' ))}
						{(showLoadTemplates) ? <Spinner /> : render_item(type)}						
					</div>
				</div>
			</Fragment>
		);

		const renderTabs = ( tab ) => {
			switch ( tab.name ) {
				case 'pages': {
					return (
						<Fragment>
							{tabContent('pages')}
						</Fragment>
					);
				}
				case 'sections': {
					return(
						<Fragment>
							{tabContent('sections')}
						</Fragment>
					);
				}
			}
		};

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState},
				}} key='inspector'/>
				<div
					className={ classnames(
						className,
					) }
				>			

					<div className="components-placeholder block-editor-inner-blocks__template-picker has-many-options">
						<div className="components-placeholder__label">
							<Dashicon icon="schedule" />{__('Templates Library', 'getwid')}
						</div>
						<div className="components-placeholder__instructions">{__('Select a template to insert layout on this page', 'getwid')}</div>
						<div className="components-placeholder__fieldset">
							
							{showLoadTemplates ? <Spinner /> :
								Object.entries( pageTemplates ).length ? (
									<Button
										className={'open-modal-button'}
										isDefault
										isLarge
										onClick={() => {
											this.setState( { showModal: true } );
										}}
									>
										{__( 'Insert Template', 'getwid' )}
									</Button>
								) : 
								(
									<Fragment>
										<p className={'no-templates'}>{__( 'Not Found Templates', 'getwid' )}</p>
										<Button
											className={'template-search-button'}
											isDefault
											onClick={ () => {
												this.setState( { showLoadTemplates : true } );
												this.getData('refresh');
											}}
										>
											{ __( 'Update Templates', 'getwid' ) }
										</Button>										
									</Fragment>
								)
							}

							{ (getState('showModal') == true) ?
								<Modal
									className={`${className}__modal-templates`}
									title= {__( 'Templates Library (Beta)', 'getwid' )}
									shouldCloseOnClickOutside={false}
									shouldCloseOnEsc={false}
									onRequestClose={ () => {
										this.setState( { showModal : false } );
									} }
								>
									<div className={`${className}__modal-toolbar`}>
										<ButtonGroup>
											<Button										
												className={'template-view-button'}
												isPrimary={(templateView == 'grid') ? true : undefined}
												isDefault={(templateView == 'list') ? true : undefined}
												onClick={ () => {
													this.setState( { templateView : 'grid' } );
												}}
											>
												<Dashicon icon="screenoptions" />
											</Button>

											<Button
												className={'template-view-button'}
												isPrimary={(templateView == 'list') ? true : undefined}
												isDefault={(templateView == 'grid') ? true : undefined}
												onClick={ () => {
													this.setState( { templateView : 'list' } );
												}}
											>
												<Dashicon icon="menu-alt" />
											</Button>																																							
										</ButtonGroup>
									</div>

									<TabPanel className='getwid-modal-editor-tabs'
										activeClass='is-active'
										tabs={ [
											{
												name: 'pages',
												title: __( 'Page', 'getwid' ),
												className: 'components-button',
											},
											{
												name: 'sections',
												title: __( 'Section', 'getwid' ),
												className: 'components-button',
											},
										] }>
										{ tab => renderTabs( tab ) }
									</TabPanel>
								</Modal>
							: null }
						</div>
					</div>
				</div>
			</Fragment>
		);	
	}
}

export default (Edit);