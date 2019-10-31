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
	TabPanel,
	BaseControl
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
* Module Constants
*/
const baseClass = 'wp-block-getwid-template-library';


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
				if (remoteData.code == 200){
					if ( this.isStillMounted && remoteData.data instanceof Object ) {
						this.setState( {
							pageCategories : remoteData.data.categories,
							pageTemplates : remoteData.data.templates,
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

	getContent(id) {	   
		const clientId = select('core/editor').getSelectedBlockClientId();

		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/getwid/v1/get_remote_content`, {
				post_id: id
			} ),
		} ).then(
			( remoteContent ) => {
				console.log( remoteContent );
				//debugger;

				//Server valiable (data.status != 404)
				if (typeof remoteContent.data == 'undefined'){
					if ( this.isStillMounted && remoteContent !='' ) {
						this.setState( {
							showLoadTemplates : false
						} );

						const blocks = parse(remoteContent);
						dispatch('core/editor').replaceBlocks(clientId, blocks);
					}
				}
			}
		).catch(
			(remoteContent) => {
				if ( this.isStillMounted ) {

				}
			}
		);		
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.getData();
	}

	componentDidUpdate(prevProps, prevState) {

	}

	render() {
		const {
			className,
			clientId
		} = this.props;

		const {
			categoryFilter,
			showLoadTemplates,
			pageTemplates,
			pageCategories,
			templateView,
			titleFilter
		} = this.state;	

		const thisBlock = $(`[data-block='${clientId}']`);

		const changeState = this.changeState;
		const getState = this.getState;

		const renderItems = (type) => {		
			let pageTemplatesArr = pageTemplates[type];


			Object.keys(pageTemplatesArr)

			//Category filter
			if (categoryFilter !=''){

				let obj = {};

				obj[categoryFilter] = pageTemplatesArr[categoryFilter];

				pageTemplatesArr = obj;

				// debugger;


// 				Object.filter = (obj, predicate) => 
// 				Object.assign(...Object.keys(obj)
// 					.filter( key => predicate(obj[key]) )
// 					.map( key => ({ [key]: obj[key] }) ) );

// debugger;

// 				var filtered = Object.filter(pageTemplatesArr, score => {
// 					debugger;
// 				}); 




				// pageTemplatesArr = pageTemplatesArr.filter((key, index) => {
				// 	let found = false;

				// 	key.categories.forEach(function(el) {
				// 		if (el.value == categoryFilter){
				// 			found = true;
				// 		}
				// 	});

				// 	return found;
				// });
			}

			//Title filter
			if (titleFilter !=''){
				Object.filter = (obj, predicate) => 
				Object.assign(...Object.keys(obj)
					.filter( key => predicate(obj[key]) )
					.map( key => ({ [key]: obj[key] }) ) );

				pageTemplatesArr = Object.filter(pageTemplatesArr, item => {
					// debugger;

					let keywords = item[0].keywords.join(', ');

					if (item[0].title.toLowerCase().indexOf(titleFilter) !== -1 || keywords.toLowerCase().indexOf(titleFilter) !== -1){
						return true
					} else {
						return false;
					}					
				}); 

				// debugger;



				// pageTemplatesArr = pageTemplatesArr.filter((key, index) => {
				// 	let keywords = key.keywords.join(', ');

				// 	if (key.title.toLowerCase().indexOf(titleFilter) !== -1 || keywords.toLowerCase().indexOf(titleFilter) !== -1){
				// 		return true
				// 	} else {
				// 		return false;
				// 	}
				// });
			}		

			// debugger;

			const renderSingleItem = (item) => {

				// debugger;

				return item.map((key, index) => {
					// debugger;

					// let categoriesArr = [];
					// if (key.categories.length){
					// 	key.categories.forEach(function(el) {
					// 		categoriesArr.push(el.label)
					// 	});
					// }
	
					return (
						<div className="template-library-container">
							<div
								className="template-library-item"
								onClick={
									(e) => {
										this.setState( {
											showModal : false,
											showLoadTemplates : true
										} );
										this.getContent(key.post_id)
									}
								}
							>
								<div className="template-image-wrapper">
									<div className="template-image" style={{ backgroundImage: `url('${key.image}')` }}></div>
								</div>
								<div className="template-content-wrapper">
									<div className="template-title">{key.title}</div>
									{/* <div className="template-categories"> {categoriesArr.join(', ')}</div> */}
									{key.description != '' && (
										<div className="template-description"> {key.description}</div>
									)}
								</div>
							</div>
						</div>																
					);

				});


			};

			if (typeof pageTemplatesArr != 'undefined'){
				if (Object.entries( pageTemplatesArr ).length){

					return (
						<Fragment>

							{Object.keys(pageTemplatesArr).map((category_key, index) => (
								<Fragment>
									<div className="template-library-category-wrapper">
										<div className="template-library-category-title">
											<h2>{pageCategories[type][category_key]}</h2>
										</div>
										<div className="template-library-category-items">
											{renderSingleItem(pageTemplatesArr[category_key])}
										</div>
									</div>
								</Fragment>	
							))}
						</Fragment>
					);

					// debugger;

					// return pageTemplatesArr.map((category_key, index) => {
					// 	debugger;
					// });
						// <div className="template-library-category-wrapper">
						// 	<div className="template-library-category-title">
						// 		<h2>{pageCategories[type][category_key]}</h2>
						// 	</div>
						// 	<div className="template-library-category-items">
						// 		{renderSingleItem(pageTemplatesArr[category_key])}
						// 	</div>
						// </div>
					// );




					// for (let category_key in pageTemplatesArr) {

					// 	map

					// 	// debugger;

					// 	return (
					// 		<div className="template-library-category-wrapper">
					// 			<div className="template-library-category-title">
					// 				<h2>{pageCategories[type][category_key]}</h2>
					// 			</div>
					// 			<div className="template-library-category-items">
					// 				{renderSingleItem(pageTemplatesArr[category_key])}
					// 			</div>
					// 		</div>
					// 	);
				
					// }
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
					<SelectControl
						className={'template-category-field'}							
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
				</Fragment>
			);
		};

		const renderUpdateButton = () => {
			return (
				<Fragment>				
					<Button
						className={'template-update-button'}
						isPrimary
						onClick={ () => {
							this.setState( { showLoadTemplates : true } );
							this.getData('refresh');
						}}
					>
						{ __( 'Update', 'getwid' ) }
					</Button>
				</Fragment>
			);
		};

		const tabContent = (type) => (
			<Fragment>
				<div
					className={`${className}__wrapper`}
				>
					<div
						className={`${className}__modal-toolbar`}
					>
						{renderCategoriesSelect(type)}
						
						<TextControl
							className={'template-search-field'}
							label={__('Template name', 'getwid')}
							value={ titleFilter ? titleFilter : '' }
							onChange={ value => {
								changeState({
									titleFilter: value.toLowerCase(),
								});
							} }
						/>
						
						<div className={`${className}__layout-view`}>
							<BaseControl
								label={__('View', 'getwid')}
							>
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
							</BaseControl>
						</div>

						<div className={`template-update-button`}>
							<BaseControl
								label={__('Action', 'getwid')}
							>
								{renderUpdateButton()}
							</BaseControl>
						</div>
					
					</div>
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
						{(showLoadTemplates) ? <Spinner /> : renderItems(type)}						
					</div>
				</div>
			</Fragment>
		);

		const renderTabs = ( tab ) => {
			switch ( tab.name ) {
				// case 'pages': {
				// 	return (
				// 		<Fragment>
				// 			{tabContent('pages')}
				// 		</Fragment>
				// 	);
				// }
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
							<Dashicon icon="category" />{__('Templates Library', 'getwid')}
						</div>
						<div className="components-placeholder__instructions">{__('Select a template to insert layout on this page', 'getwid')}</div>
						<div className="components-placeholder__fieldset">

							<div className="insert-template-button">
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
							</div>								

							{showLoadTemplates ? <Spinner /> :
								Object.entries( pageTemplates ).length ? (
									<Fragment>

									</Fragment>
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
									shouldCloseOnClickOutside={true}
									shouldCloseOnEsc={true}
									onRequestClose={ () => {
										let templatePlaceholder = $( `.${baseClass}`, thisBlock );

										if (templatePlaceholder.data('closeModal')){
											dispatch('core/editor').removeBlock(clientId);
										} else {
											this.setState( { showModal : false } );
										}
									} }
								>


									<TabPanel className='getwid-modal-editor-tabs'
										activeClass='is-active'
										tabs={ [
											// {
											// 	name: 'pages',
											// 	title: __( 'Page', 'getwid' ),
											// 	className: 'components-button',
											// },
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