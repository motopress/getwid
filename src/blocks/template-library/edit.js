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
const {jQuery: $} = window;

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
			templatesInfo: [],
			pageCategories: [],
			categoryFilter: '',
			titleFilter: '',
			showLoadTemplates: true,
			showModal: false,
			templateLayout: 3,
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
				//console.log( remoteData );
				//debugger;

				//Server valiable (data.status != 404)
				if (remoteData.code == 200){

					Getwid.remote_templates = remoteData.data; //Store in JS

					if ( this.isStillMounted && remoteData.data instanceof Object ) {
						this.setState( {
							pageCategories : remoteData.data.categories,
							pageTemplates : remoteData.data.templates,
							templatesInfo : remoteData.data.info,
							showLoadTemplates : false
						} );
					} else {
						this.setState( {
							pageCategories: null,
							pageTemplates: null,
							templatesInfo: null,
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

	getContent(request_url) {
		const clientId = select('core/editor').getSelectedBlockClientId();

		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/getwid/v1/get_remote_content`, {
				get_content_url: request_url
			} ),
		} ).then(
			( remoteContent ) => {
				//console.log( remoteContent );
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

	getStorageData(remoteData) {
		this.setState( {
			pageCategories : remoteData.categories,
			pageTemplates : remoteData.templates,
			templatesInfo : remoteData.info,
			showLoadTemplates : false
		} );
	}

	setContentHeight(){
		const modal_window = jQuery('.wp-block-getwid-template-library__modal-templates');
		const modal_height = modal_window.height();
		const modal_header_height = jQuery('.components-modal__header', modal_window).outerHeight();
		const toolbar_height = jQuery('.wp-block-getwid-template-library__modal-toolbar', modal_window).outerHeight();
		jQuery('.template-library-list').css('height', (modal_height - (modal_header_height + toolbar_height)) + 'px');
	}

	initSticky(){
		$( window ).resize(() => {
			this.setContentHeight();
		});
		this.setContentHeight();
	}

	componentWillMount() {
		this.isStillMounted = true;

		const templateLayout = localStorage.getItem( 'layoutCount' );
		if ( templateLayout != null ) {
			this.setState( { templateLayout } );
		}

		//Send AJAX request
		if ( typeof Getwid.remote_templates == 'undefined' ) {
			this.getData();
		} else { //Get Data from JS
			this.getStorageData( Getwid.remote_templates );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// this.initSticky();
	}

	componentWillUnmount() {
		const { templateLayout } = this.state;
		localStorage.setItem( 'layoutCount', templateLayout );
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
			templateLayout,
			titleFilter,
			templatesInfo,
		} = this.state;

		const thisBlock = $(`[data-block='${clientId}']`);

		const changeState = this.changeState;
		const getState = this.getState;

		const renderItems = (type) => {
			let pageTemplatesArr = pageTemplates[type];

			//Category filter
			if (categoryFilter !=''){

				let obj = {};
				obj[categoryFilter] = pageTemplatesArr[categoryFilter];
				pageTemplatesArr = obj;
			}

			//Title filter
			if (titleFilter !=''){
				let filteredObj = {};

				for (const category_name in pageTemplatesArr) {
					const categoryFilteredArr = pageTemplatesArr[category_name].filter((key, index) => {
						const keywords = key.keywords.join(', ');

						if (key.title.toLowerCase().indexOf(titleFilter) !== -1 || keywords.toLowerCase().indexOf(titleFilter) !== -1){
							return true
						} else {
							return false;
						}
					});

					if (categoryFilteredArr.length){
						filteredObj[category_name] = categoryFilteredArr;
					}
				}

				pageTemplatesArr = filteredObj;
			}

			const renderSingleItem = (item) => {

				return item.map((key, index) => {

					return (
						<div className="template-library-container">
							<div
								className="template-library-item"
								onClick={
									(e) => {

									}
								}
							>
								<div className="template-image-wrapper">
									<div className="template-image" style={{ backgroundImage: `url('${key.image}')` }}></div>
								</div>
								<div className="template-content-wrapper">
								<div className="template-title">{key.title}</div>
									{key.description != '' && (
										<div className="template-description"> {key.description}</div>
									)}
									<Button
										className={'template-insert-button'}
										isPrimary
										onClick={
											(e) => {
												this.setState( {
													showModal : false,
													showLoadTemplates : true
												} );

												this.getContent(key.get_content_url)
											}
										}
									>
										{ __( 'Insert Template', 'getwid' ) }
									</Button>
								</div>
							</div>
						</div>
					);

				});


			};

			if (typeof pageTemplatesArr != 'undefined') {
				if (Object.entries( pageTemplatesArr ).length){
					return (
						<Fragment>

							{Object.keys(pageTemplatesArr).map((category_key, index) => {
								return (
									<Fragment>
										<div className="template-library-category-wrapper">
											<div className="template-library-category-title">
												<h2>{(typeof pageCategories[type] != 'undefined' ? pageCategories[type][category_key] : undefined)}</h2>
											</div>
											<div className="template-library-category-items">
												{renderSingleItem(pageTemplatesArr[category_key])}
											</div>
										</div>
									</Fragment>
								);
							})}
						</Fragment>
					);
				} else {
					return (__( 'No templates found.', 'getwid' ));
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
						autoFocus={ false }
						value={ categoryFilter ? categoryFilter : '' }
						onChange={ (value) => {
							changeState({
								categoryFilter: value,
							});
						} }
						options={[
							...[{'value': '', 'label': __( 'All Categories', 'getwid' ) }],
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
							placeholder={__('Search', 'getwid')}
							value={ titleFilter ? titleFilter : '' }
							onChange={ value => {
								changeState({
									titleFilter: value.toLowerCase(),
								});
							} }
						/>

						<div className={`${className}__layout-view`}>
							<BaseControl>
								<ButtonGroup>
									<Button
										className={'template-view-button'}
										isPrimary={(templateLayout == 1) ? true : undefined}
										isDefault={(templateLayout != 1) ? true : undefined}
										onClick={ () => {
											this.setState( { templateLayout : 1 } );
										}}
									>
										1
									</Button>

									<Button
										className={'template-view-button'}
										isPrimary={(templateLayout == 2) ? true : undefined}
										isDefault={(templateLayout != 2) ? true : undefined}
										onClick={ () => {
											this.setState( { templateLayout : 2 } );
										}}
									>
										2
									</Button>

									<Button
										className={'template-view-button'}
										isPrimary={(templateLayout == 3) ? true : undefined}
										isDefault={(templateLayout != 3) ? true : undefined}
										onClick={ () => {
											this.setState( { templateLayout : 3 } );
										}}
									>
										3
									</Button>

									<Button
										className={'template-view-button'}
										isPrimary={(templateLayout == 4) ? true : undefined}
										isDefault={(templateLayout != 4) ? true : undefined}
										onClick={ () => {
											this.setState( { templateLayout : 4 } );
										}}
									>
										4
									</Button>
								</ButtonGroup>
							</BaseControl>
						</div>

						{ Getwid.settings.debug ? (
								<div className={`template-update-button`}>
									<BaseControl>
										{renderUpdateButton()}
									</BaseControl>
								</div>
							) : null
						}

					</div>

					<div className={
						classnames(
							'template-library-list',
							`has-columns-${templateLayout}`,
							{
								['loading-items'] : showLoadTemplates || ( pageTemplates ? Object.entries( pageTemplates ).length == 0 : null )
							}
						)
					}>
						{( ( pageTemplates ? Object.entries( pageTemplates ).length == 0 : null ) && showLoadTemplates == false) && (__( 'No templates found.', 'getwid' ))}
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
							<Dashicon icon="category" />{__('Template Library', 'getwid')}
						</div>
						<div className="components-placeholder__instructions">{__('Choose a template from the library.', 'getwid')}</div>
						<div className="components-placeholder__fieldset">

							{ showLoadTemplates ? <Spinner /> :

								Object.entries( pageTemplates ).length ? (
									<div className={'insert-template-button'}>
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
								) :
								(
									<Fragment>
										<p className={'no-templates'}>{__( 'No templates found.', 'getwid' )}</p>
										<Button
											className={'template-search-button'}
											isDefault
											onClick={ () => {
												this.setState( { showLoadTemplates : true } );
												this.getData('refresh');
											}}
										>
											{ __( 'Update', 'getwid' ) }
										</Button>
									</Fragment>
								)
							}

							{ (getState('showModal') == true) ?
								<Modal
									className={`${className}__modal-templates`}
									title= {__( 'Template Library', 'getwid' )}
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