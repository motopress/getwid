import {
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import {
	BaseControl,
	Button,
	ButtonGroup,
	Dashicon,
	Modal,
	SelectControl,
	Spinner,
	TabPanel,
	TextControl,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import {
	clearToolbarInsertedBlock,
	getRemoteTemplates,
	isToolbarInsertedBlock,
	setRemoteTemplates,
} from './state';
import type {
	RemoteTemplate,
	RemoteTemplateData,
	RemoteTemplateResponse,
	TemplateCategories,
	TemplateGroups,
	TemplateLibraryEditProps,
	TemplateType,
} from './types';

import './editor.scss';

type ApiFetch = < Response >( options: {
	path: string;
} ) => Promise< Response >;
type AddQueryArgs = ( url: string, args: Record< string, string > ) => string;

const baseClass = 'wp-block-getwid-template-library';
const globalWindow = window as Window & {
	Getwid?: {
		settings?: { debug?: boolean };
		remote_templates?: RemoteTemplateData;
	};
	wp?: {
		apiFetch?: ApiFetch;
		url?: { addQueryArgs?: AddQueryArgs };
	};
};
const apiFetch = globalWindow.wp?.apiFetch;
const addQueryArgs = globalWindow.wp?.url?.addQueryArgs;

function hasTemplates( templates: TemplateGroups ) {
	return Object.keys( templates ).length > 0;
}

export default function Edit( {
	clientId,
	className,
}: TemplateLibraryEditProps ) {
	const [ pageTemplates, setPageTemplates ] = useState< TemplateGroups >(
		{}
	);
	const [ pageCategories, setPageCategories ] =
		useState< TemplateCategories >( {} );
	const [ categoryFilter, setCategoryFilter ] = useState( '' );
	const [ titleFilter, setTitleFilter ] = useState( '' );
	const [ showLoadTemplates, setShowLoadTemplates ] = useState( true );
	const [ showModal, setShowModal ] = useState( false );
	const [ templateLayout, setTemplateLayout ] = useState( 3 );
	const isMounted = useRef( true );
	const { removeBlock, replaceBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( { className } );

	const applyRemoteData = useCallback( ( remoteData: RemoteTemplateData ) => {
		setPageCategories( remoteData.categories ?? {} );
		setPageTemplates( remoteData.templates ?? {} );
		setShowLoadTemplates( false );
	}, [] );

	const getData = useCallback(
		async ( cacheRequest = 'cache' ) => {
			if ( ! apiFetch || ! addQueryArgs ) {
				setPageCategories( {} );
				setPageTemplates( {} );
				setShowLoadTemplates( false );
				return;
			}

			try {
				const response = await apiFetch< RemoteTemplateResponse >( {
					path: addQueryArgs( '/getwid/v1/get_remote_templates', {
						cache: cacheRequest,
					} ),
				} );

				if ( ! isMounted.current ) {
					return;
				}

				if ( response.code === 200 && response.data ) {
					setRemoteTemplates( response.data );
					if ( globalWindow.Getwid ) {
						globalWindow.Getwid.remote_templates = response.data;
					}
					applyRemoteData( response.data );
					return;
				}

				setPageCategories( {} );
				setPageTemplates( {} );
				setShowLoadTemplates( false );
			} catch {
				if ( isMounted.current ) {
					setPageCategories( {} );
					setPageTemplates( {} );
					setShowLoadTemplates( false );
				}
			}
		},
		[ applyRemoteData ]
	);

	const getContent = useCallback(
		async ( requestUrl: string ) => {
			if ( ! apiFetch || ! addQueryArgs ) {
				setShowLoadTemplates( false );
				return;
			}

			try {
				const remoteContent = await apiFetch< unknown >( {
					path: addQueryArgs( '/getwid/v1/get_remote_content', {
						get_content_url: requestUrl,
					} ),
				} );

				if (
					isMounted.current &&
					typeof remoteContent === 'string' &&
					remoteContent !== ''
				) {
					replaceBlocks( clientId, parse( remoteContent ) );
					return;
				}

				if ( isMounted.current ) {
					setShowLoadTemplates( false );
				}
			} catch {
				if ( isMounted.current ) {
					setShowLoadTemplates( false );
				}
			}
		},
		[ clientId, replaceBlocks ]
	);

	useEffect( () => {
		isMounted.current = true;

		const savedLayout = Number.parseInt(
			window.localStorage.getItem( 'layoutCount' ) ?? '',
			10
		);

		if ( savedLayout >= 1 && savedLayout <= 4 ) {
			setTemplateLayout( savedLayout );
		}

		const cachedTemplates =
			getRemoteTemplates() ?? globalWindow.Getwid?.remote_templates;
		if ( cachedTemplates ) {
			applyRemoteData( cachedTemplates );
		} else {
			void getData();
		}

		if ( isToolbarInsertedBlock( clientId ) ) {
			setShowModal( true );
		}

		return () => {
			isMounted.current = false;
			clearToolbarInsertedBlock( clientId );
		};
	}, [ applyRemoteData, clientId, getData ] );

	useEffect( () => {
		window.localStorage.setItem( 'layoutCount', String( templateLayout ) );
	}, [ templateLayout ] );

	function insertTemplate( template: RemoteTemplate ) {
		setShowModal( false );
		setShowLoadTemplates( true );
		void getContent( template.get_content_url );
	}

	function getFilteredGroups(
		type: TemplateType
	): Record< string, RemoteTemplate[] > {
		let groups = pageTemplates[ type ] ?? {};

		if ( categoryFilter ) {
			const selectedGroup = groups[ categoryFilter ];
			groups = selectedGroup ? { [ categoryFilter ]: selectedGroup } : {};
		}

		if ( ! titleFilter ) {
			return groups;
		}

		const filteredGroups: Record< string, RemoteTemplate[] > = {};

		Object.entries( groups ).forEach( ( [ categoryName, templates ] ) => {
			const filteredTemplates = templates.filter( ( template ) => {
				const keywords = template.keywords.join( ', ' ).toLowerCase();
				return (
					template.title.toLowerCase().includes( titleFilter ) ||
					keywords.includes( titleFilter )
				);
			} );

			if ( filteredTemplates.length ) {
				filteredGroups[ categoryName ] = filteredTemplates;
			}
		} );

		return filteredGroups;
	}

	function renderItems( type: TemplateType ) {
		const groups = getFilteredGroups( type );
		const categories = pageCategories[ type ] ?? {};

		if ( Object.keys( groups ).length === 0 ) {
			return __( 'No templates found.', 'getwid' );
		}

		return Object.entries( groups ).map( ( [ categoryKey, templates ] ) => (
			<div
				className="template-library-category-wrapper"
				key={ categoryKey }
			>
				<div className="template-library-category-title">
					<h2>{ categories[ categoryKey ] }</h2>
				</div>
				<div className="template-library-category-items">
					{ templates.map( ( template ) => (
						<div
							className="template-library-container"
							key={ template.get_content_url }
						>
							<div className="template-library-item">
								<div className="template-image-wrapper">
									<div
										className="template-image"
										style={ {
											backgroundImage: `url('${ template.image }')`,
										} }
									></div>
								</div>
								<div className="template-content-wrapper">
									<div className="template-title">
										{ template.title }
									</div>
									{ template.description !== '' && (
										<div className="template-description">
											{ template.description }
										</div>
									) }
									<Button
										className="template-insert-button"
										variant="primary"
										onClick={ () =>
											insertTemplate( template )
										}
									>
										{ __( 'Insert Template', 'getwid' ) }
									</Button>
								</div>
							</div>
						</div>
					) ) }
				</div>
			</div>
		) );
	}

	function renderCategorySelect( type: TemplateType ) {
		const categories = pageCategories[ type ] ?? {};
		const options = Object.entries( categories ).map(
			( [ value, label ] ) => ( {
				value,
				label,
			} )
		);

		return (
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				className="template-category-field"
				value={ categoryFilter }
				onChange={ setCategoryFilter }
				options={ [
					{ value: '', label: __( 'All Categories', 'getwid' ) },
					...options,
				] }
			/>
		);
	}

	function renderTabContent( type: TemplateType ) {
		const empty = ! hasTemplates( pageTemplates );

		return (
			<div className={ `${ baseClass }__wrapper` }>
				<div className={ `${ baseClass }__modal-toolbar` }>
					{ renderCategorySelect( type ) }
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						className="template-search-field"
						placeholder={ __( 'Search', 'getwid' ) }
						value={ titleFilter }
						onChange={ ( value ) =>
							setTitleFilter( value.toLowerCase() )
						}
					/>

					<div className={ `${ baseClass }__layout-view` }>
						<BaseControl __nextHasNoMarginBottom>
							<ButtonGroup>
								{ [ 1, 2, 3, 4 ].map( ( columns ) => (
									<Button
										key={ columns }
										className="template-view-button"
										variant={
											templateLayout === columns
												? 'primary'
												: 'secondary'
										}
										onClick={ () =>
											setTemplateLayout( columns )
										}
									>
										{ columns }
									</Button>
								) ) }
							</ButtonGroup>
						</BaseControl>
					</div>

					{ globalWindow.Getwid?.settings?.debug && (
						<div className="template-update-button">
							<BaseControl __nextHasNoMarginBottom>
								<Button
									className="template-update-button"
									variant="primary"
									onClick={ () => {
										setShowLoadTemplates( true );
										void getData( 'refresh' );
									} }
								>
									{ __( 'Update', 'getwid' ) }
								</Button>
							</BaseControl>
						</div>
					) }
				</div>

				<div
					className={ clsx(
						'template-library-list',
						`has-columns-${ templateLayout }`,
						{ 'loading-items': showLoadTemplates || empty }
					) }
				>
					{ empty &&
						! showLoadTemplates &&
						__( 'No templates found.', 'getwid' ) }
					{ showLoadTemplates ? <Spinner /> : renderItems( type ) }
				</div>
			</div>
		);
	}

	function closeModal() {
		if ( isToolbarInsertedBlock( clientId ) ) {
			clearToolbarInsertedBlock( clientId );
			removeBlock( clientId );
			return;
		}

		setShowModal( false );
	}

	return (
		<div { ...blockProps }>
			<div className="components-placeholder block-editor-inner-blocks__template-picker has-many-options">
				<div className="components-placeholder__label">
					<Dashicon icon="category" />
					{ __( 'Template Library', 'getwid' ) }
				</div>
				<div className="components-placeholder__instructions">
					{ __( 'Choose a template from the library.', 'getwid' ) }
				</div>
				<div className="components-placeholder__fieldset">
					{ showLoadTemplates ? (
						<Spinner />
					) : hasTemplates( pageTemplates ) ? (
						<div className="insert-template-button">
							<Button
								className="open-modal-button"
								variant="secondary"
								onClick={ () => setShowModal( true ) }
							>
								{ __( 'Insert Template', 'getwid' ) }
							</Button>
						</div>
					) : (
						<>
							<p className="no-templates">
								{ __( 'No templates found.', 'getwid' ) }
							</p>
							<Button
								className="template-search-button"
								variant="secondary"
								onClick={ () => {
									setShowLoadTemplates( true );
									void getData( 'refresh' );
								} }
							>
								{ __( 'Update', 'getwid' ) }
							</Button>
						</>
					) }
				</div>
			</div>

			{ showModal && (
				<Modal
					className={ `${ baseClass }__modal-templates` }
					title={ __( 'Template Library', 'getwid' ) }
					shouldCloseOnClickOutside
					shouldCloseOnEsc
					onRequestClose={ closeModal }
				>
					<TabPanel
						className="getwid-modal-editor-tabs"
						activeClass="is-active"
						tabs={ [
							{
								name: 'sections',
								title: __( 'Section', 'getwid' ),
								className: 'components-button',
							},
						] }
					>
						{ () => renderTabContent( 'sections' ) }
					</TabPanel>
				</Modal>
			) }
		</div>
	);
}
