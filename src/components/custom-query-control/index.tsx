import {
	Button,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import GetwidSelectControl from '../select-control';
import QueryModal from './components/query-modal';
import type {
	AddQueryArgs,
	ApiFetch,
	MetaQueryGroup,
	PostTypeOption,
	QueryValues,
	TermGroup,
} from './types';

import './editor.scss';

const controlClassPrefix = 'components-getwid-custom-query-control';
const wpGlobal = (
	window as unknown as {
		wp?: {
			apiFetch?: unknown;
			url?: {
				addQueryArgs?: unknown;
			};
		};
	}
 ).wp;
const apiFetch = wpGlobal?.apiFetch as ApiFetch | undefined;
const addQueryArgs = wpGlobal?.url?.addQueryArgs as AddQueryArgs | undefined;

type CustomQueryControlProps = {
	values: QueryValues;
	setValues: ( values: Partial< QueryValues > ) => void;
	options?: string[];
	callbackOn?: string[];
	onChangeCallback?: ( value: unknown, element: string ) => void;
	postTypes?: PostTypeOption[];
};

function applyChange(
	props: CustomQueryControlProps,
	key: keyof QueryValues,
	value: unknown
) {
	if ( props.callbackOn?.includes( key ) ) {
		props.onChangeCallback?.( value, key );
		return;
	}

	props.setValues( { [ key ]: value } as Partial< QueryValues > );
}

function CustomQueryControl( props: CustomQueryControlProps ) {
	const { values, options = [], postTypes = [] } = props;
	const [ taxonomyList, setTaxonomyList ] = useState<
		PostTypeOption[] | null
	>( null );
	const [ termsList, setTermsList ] = useState< Record<
		string,
		TermGroup
	> | null >( null );
	const [ isTaxonomyLoading, setIsTaxonomyLoading ] = useState( false );
	const [ isTermsLoading, setIsTermsLoading ] = useState( false );
	const [ modalOpen, setModalOpen ] = useState( false );
	const firstCheckTaxonomy = useRef( true );
	const firstCheckTerms = useRef( true );

	function getTaxonomyFromCustomPostType( postType?: string ) {
		if ( ! postType || ! apiFetch || ! addQueryArgs ) {
			return;
		}

		setIsTaxonomyLoading( true );
		firstCheckTaxonomy.current = false;
		apiFetch< PostTypeOption[] >( {
			path: addQueryArgs( '/getwid/v1/taxonomies', {
				post_type_name: postType,
			} ),
		} )
			.then( ( nextTaxonomyList ) => {
				setTaxonomyList(
					Array.isArray( nextTaxonomyList ) && nextTaxonomyList.length
						? nextTaxonomyList
						: null
				);
			} )
			.catch( () => undefined )
			.finally( () => setIsTaxonomyLoading( false ) );
	}

	function getTermsFromTaxonomy( taxonomy?: string[] ) {
		if ( ! taxonomy || ! apiFetch || ! addQueryArgs ) {
			return;
		}

		setIsTermsLoading( true );
		firstCheckTerms.current = false;
		apiFetch< Record< string, TermGroup > >( {
			path: addQueryArgs( '/getwid/v1/terms', {
				taxonomy_name: taxonomy.join( ',' ),
			} ),
		} )
			.then( ( nextTermsList ) => {
				setTermsList(
					nextTermsList && Object.keys( nextTermsList ).length
						? nextTermsList
						: null
				);
			} )
			.catch( () => undefined )
			.finally( () => setIsTermsLoading( false ) );
	}

	useEffect( () => {
		if (
			taxonomyList === null &&
			values.postType &&
			firstCheckTaxonomy.current
		) {
			getTaxonomyFromCustomPostType( values.postType );
		}
	}, [ taxonomyList, values.postType ] );

	useEffect( () => {
		if (
			termsList === null &&
			values.taxonomy &&
			firstCheckTerms.current
		) {
			getTermsFromTaxonomy( values.taxonomy );
		}
	}, [ termsList, values.taxonomy ] );

	return (
		<div
			className={ clsx( 'components-base-control', controlClassPrefix ) }
		>
			<SelectControl
				label={ __( 'Choose what to display', 'getwid' ) }
				className={ `${ controlClassPrefix }__post-type` }
				value={ values.postType || '' }
				onChange={ ( value ) => {
					setTaxonomyList( null );
					setTermsList( null );
					props.setValues( {
						postType: value || undefined,
						taxonomy: undefined,
						terms: undefined,
					} );
					getTaxonomyFromCustomPostType( value );
				} }
				options={
					postTypes.length ? postTypes : [ { value: '', label: '-' } ]
				}
			/>
			<RangeControl
				label={
					options.includes( 'page' ) && values.pagination
						? __( 'Number of items per page', 'getwid' )
						: __( 'Number of items', 'getwid' )
				}
				value={ values.postsToShow }
				onChange={ ( value ) =>
					applyChange( props, 'postsToShow', value )
				}
				min={ -1 }
				max={ 100 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Number of posts to pass over', 'getwid' ) }
				value={ values.offset }
				onChange={ ( value ) => applyChange( props, 'offset', value ) }
				min={ 0 }
				max={ 100 }
				step={ 1 }
			/>
			{ options.includes( 'page' ) && (
				<ToggleControl
					label={ __( 'Use pagination', 'getwid' ) }
					checked={ values.pagination || false }
					onChange={ () =>
						applyChange( props, 'pagination', ! values.pagination )
					}
				/>
			) }
			<PanelBody
				title={ __( 'Sorting and Filtering', 'getwid' ) }
				initialOpen={ false }
			>
				<SelectControl
					label={ __( 'Order', 'getwid' ) }
					className={ `${ controlClassPrefix }__order` }
					value={ values.order || '' }
					onChange={ ( value ) =>
						applyChange( props, 'order', value )
					}
					options={ [
						{
							value: 'desc',
							label: __( 'Z → A, 9 → 1', 'getwid' ),
						},
						{
							value: 'asc',
							label: __( 'A → Z, 1 → 9', 'getwid' ),
						},
					] }
				/>
				<SelectControl
					label={ __( 'Order by', 'getwid' ) }
					className={ `${ controlClassPrefix }__order-by` }
					value={ values.orderBy || '' }
					onChange={ ( value ) =>
						applyChange( props, 'orderBy', value )
					}
					options={ [
						{ value: 'title', label: __( 'Title', 'getwid' ) },
						{ value: 'date', label: __( 'Date', 'getwid' ) },
						{ value: 'rand', label: __( 'Random', 'getwid' ) },
						{ value: 'author', label: __( 'Author', 'getwid' ) },
						{
							value: 'modified',
							label: __( 'Last modified date', 'getwid' ),
						},
						{
							value: 'menu_order',
							label: __( 'Menu order', 'getwid' ),
						},
					] }
				/>
				{ values.postType !== 'page' &&
					options.includes( 'sticky' ) && (
						<ToggleControl
							label={ __( 'Ignore Sticky posts', 'getwid' ) }
							checked={ values.ignoreSticky || false }
							onChange={ () =>
								applyChange(
									props,
									'ignoreSticky',
									! values.ignoreSticky
								)
							}
						/>
					) }
				<TextControl
					label={ __( 'Display only the specific posts', 'getwid' ) }
					help={ __( 'Comma-separated IDs', 'getwid' ) }
					value={ values.filterById || '' }
					onChange={ ( value ) =>
						applyChange( props, 'filterById', value )
					}
				/>
				<TextControl
					label={ __(
						'Display all posts but NOT the specified ones',
						'getwid'
					) }
					help={ __( 'Comma-separated IDs', 'getwid' ) }
					value={ values.excludeById || '' }
					onChange={ ( value ) =>
						applyChange( props, 'excludeById', value )
					}
				/>
				<ToggleControl
					label={ __( 'Exclude Current Post', 'getwid' ) }
					checked={ values.excludeCurrentPost || false }
					onChange={ () =>
						applyChange(
							props,
							'excludeCurrentPost',
							! values.excludeCurrentPost
						)
					}
				/>
				{ values.postType === 'page' &&
					options.includes( 'parentFilter' ) && (
						<Fragment>
							<ToggleControl
								label={ __(
									'Display child pages of current page',
									'getwid'
								) }
								checked={
									values.childPagesCurrentPage || false
								}
								onChange={ () =>
									applyChange(
										props,
										'childPagesCurrentPage',
										! values.childPagesCurrentPage
									)
								}
							/>
							{ values.childPagesCurrentPage === false && (
								<TextControl
									label={ __(
										'Enter page ID to display its child pages',
										'getwid'
									) }
									help={ __( 'Parent page ID', 'getwid' ) }
									value={ values.parentPageId || '' }
									onChange={ ( value ) =>
										applyChange(
											props,
											'parentPageId',
											value
										)
									}
								/>
							) }
						</Fragment>
					) }
				{ values.postType !== 'page' && (
					<Fragment>
						{ isTaxonomyLoading && <Spinner /> }
						<SelectControl
							label={ __( 'Taxonomies', 'getwid' ) }
							help={ __(
								'Hold ctrl/cmd to select multiple or deselect',
								'getwid'
							) }
							className={ `${ controlClassPrefix }__taxonomy` }
							value={ values.taxonomy || [] }
							onChange={ ( value ) => {
								const nextValue = Array.isArray( value )
									? value
									: [ value ];
								setTermsList( null );
								props.setValues( {
									taxonomy: nextValue.length
										? nextValue
										: undefined,
									terms: undefined,
								} );
								getTermsFromTaxonomy( nextValue );
							} }
							multiple
							size={ 6 }
							options={
								taxonomyList || [ { value: '', label: '' } ]
							}
							disabled={ taxonomyList === null }
						/>
						{ isTermsLoading && <Spinner /> }
						<GetwidSelectControl
							label={ __( 'Terms', 'getwid' ) }
							help={ __(
								'Hold ctrl/cmd to select multiple or deselect',
								'getwid'
							) }
							className={ `${ controlClassPrefix }__terms` }
							multiple
							groups
							size={ 10 }
							value={ values.terms || [] }
							onChange={ ( value ) => {
								const nextValue = Array.isArray( value )
									? value
									: [ value ];
								props.setValues( {
									terms: nextValue.length
										? nextValue
										: undefined,
								} );
							} }
							options={
								termsList || {
									'': {
										group_name: '',
										group_value: [
											{ value: '', label: '' },
										],
									},
								}
							}
							disabled={ termsList === null }
						/>
						<RadioControl
							label={ __( 'Terms Relation', 'getwid' ) }
							selected={ values.relation || '' }
							options={ [
								{
									value: 'AND',
									label: __(
										'Item should have all of selected terms.',
										'getwid'
									),
								},
								{
									value: 'OR',
									label: __(
										'Item should have at least one of selected terms.',
										'getwid'
									),
								},
							] }
							onChange={ ( value ) =>
								applyChange( props, 'relation', value )
							}
						/>
					</Fragment>
				) }
				<Button
					variant="primary"
					icon="filter"
					onClick={ () => setModalOpen( true ) }
				>
					{ __( 'Custom Field Filter', 'getwid' ) }
				</Button>
				{ modalOpen && (
					<QueryModal
						onRequestClose={ () => setModalOpen( false ) }
						query={ values }
						metaQuery={ values.metaQuery }
						updateMetaQuery={ ( metaQuery ) =>
							props.setValues( { metaQuery } )
						}
					/>
				) }
			</PanelBody>
		</div>
	);
}

type CorePostType = {
	slug: string;
	name: string;
};

export function CustomQueryToolbarButton( {
	query,
	metaQuery,
	updateMetaQuery,
}: {
	query: QueryValues;
	metaQuery?: MetaQueryGroup[];
	updateMetaQuery: ( metaQuery: MetaQueryGroup[] ) => void;
} ) {
	const [ modalOpen, setModalOpen ] = useState( false );

	return (
		<ToolbarGroup>
			<ToolbarButton
				icon="filter"
				label={ __( 'Custom Field Filter', 'getwid' ) }
				isPressed={ ( metaQuery?.length || 0 ) > 0 }
				onClick={ () => setModalOpen( true ) }
			/>
			{ modalOpen && (
				<QueryModal
					onRequestClose={ () => setModalOpen( false ) }
					metaQuery={ metaQuery }
					query={ query }
					updateMetaQuery={ updateMetaQuery }
				/>
			) }
		</ToolbarGroup>
	);
}

export default function ConnectedCustomQueryControl(
	props: Omit< CustomQueryControlProps, 'postTypes' >
) {
	const postTypes = useSelect( ( select ) => {
		const core = select( 'core' ) as {
			getPostTypes: ( query: {
				per_page: number;
			} ) => CorePostType[] | undefined;
		};
		const records = core.getPostTypes( { per_page: -1 } );

		if ( ! records ) {
			return [];
		}

		return records
			.filter(
				( type ) =>
					! [
						'attachment',
						'wp_block',
						'getwid_template_part',
						'getwid_template',
					].includes( type.slug )
			)
			.map( ( type ) => ( {
				value: type.slug,
				label: type.name,
			} ) );
	}, [] );

	return <CustomQueryControl { ...props } postTypes={ postTypes } />;
}
