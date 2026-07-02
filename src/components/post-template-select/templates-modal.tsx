import { Button, Disabled, Flex, Modal, Spinner } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import './editor.scss';

type TemplateOption = {
	value: number;
	label?: string;
};

type GetwidTemplatesGlobal = {
	templates: {
		new: string;
		view: string;
		edit: string;
	};
};

type ApiFetch = < T = unknown >( options: { path: string } ) => Promise< T >;
type AddQueryArgs = ( path: string, args: Record< string, string > ) => string;

type TemplatesModalProps = {
	onClose: () => void;
	previewRender: ( templateID: number ) => JSX.Element;
	selectedTemplate?: string;
	onSelect: ( templateID: string ) => void;
};

const globalWindow = window as unknown as {
	wp?: {
		apiFetch?: unknown;
		url?: {
			addQueryArgs?: unknown;
		};
	};
	Getwid?: GetwidTemplatesGlobal;
};
const apiFetch = globalWindow.wp?.apiFetch as ApiFetch | undefined;
const addQueryArgs = globalWindow.wp?.url?.addQueryArgs as
	| AddQueryArgs
	| undefined;
const getwid = globalWindow.Getwid;

export default function TemplatesModal( {
	onClose,
	previewRender,
	selectedTemplate,
	onSelect,
}: TemplatesModalProps ) {
	const [ templates, setTemplates ] = useState< TemplateOption[] >( [] );
	const [ loading, setLoading ] = useState( true );

	const loadTemplates = useCallback( () => {
		if ( ! apiFetch || ! addQueryArgs ) {
			setLoading( false );
			return;
		}

		setLoading( true );
		apiFetch< TemplateOption[] >( {
			path: addQueryArgs( '/getwid/v1/templates', {
				template_name: 'getwid_template_part',
			} ),
		} )
			.then( ( nextTemplates ) => setTemplates( nextTemplates ) )
			.finally( () => setLoading( false ) );
	}, [] );

	useEffect( () => {
		loadTemplates();
	}, [ loadTemplates ] );

	return (
		<Modal
			title={ __( 'Select Template', 'getwid' ) }
			onRequestClose={ onClose }
			isFullScreen
			className="components-getwid-templates"
			headerActions={
				<Flex expanded={ false }>
					<Button
						href={ getwid?.templates.new }
						target="_blank"
						variant="primary"
					>
						{ __( 'Create Template', 'getwid' ) }
					</Button>
					<Button
						variant="secondary"
						disabled={ ! selectedTemplate }
						onClick={ () => {
							onClose();
							onSelect( '' );
						} }
					>
						{ __( 'Use Default Template', 'getwid' ) }
					</Button>
					<Button
						href={ getwid?.templates.view }
						target="_blank"
						variant="secondary"
					>
						{ __( 'View All Templates', 'getwid' ) }
					</Button>
					<Button
						onClick={ loadTemplates }
						isBusy={ loading }
						disabled={ loading }
						variant="secondary"
					>
						{ __( 'Reload Templates', 'getwid' ) }
					</Button>
				</Flex>
			}
		>
			{ loading && <Spinner /> }
			<div className="components-getwid-templates__list">
				{ templates.map( ( template ) => (
					<div
						key={ template.value }
						className={ clsx(
							'components-getwid-templates__template',
							{
								'is-selected':
									template.value ===
									Number.parseInt(
										selectedTemplate || '',
										10
									),
							}
						) }
					>
						<Flex
							gap={ 0 }
							expanded={ false }
							direction="column"
							className="components-getwid-templates__template-wrapper"
						>
							<Disabled className="components-getwid-templates__template-preview">
								{ previewRender( template.value ) }
							</Disabled>
							<Flex className="components-getwid-templates__template-footer">
								<span className="components-getwid-templates__template-title">
									{ template.label || `#${ template.value }` }
								</span>
								<Flex
									expanded={ false }
									justify="flex-end"
									className="components-getwid-templates__template-actions"
								>
									<Button
										variant="primary"
										disabled={
											template.value ===
											Number.parseInt(
												selectedTemplate || '',
												10
											)
										}
										onClick={ () => {
											onClose();
											onSelect(
												template.value.toString()
											);
										} }
									>
										{ __( 'Apply', 'getwid' ) }
									</Button>
									<Button
										href={ `${ getwid?.templates.edit }${ template.value }&action=edit` }
										target="_blank"
										variant="secondary"
									>
										{ __( 'Edit', 'getwid' ) }
									</Button>
								</Flex>
							</Flex>
						</Flex>
					</div>
				) ) }
				{ ! loading && templates.length < 1 && (
					<p>{ __( 'No templates found.', 'getwid' ) }</p>
				) }
			</div>
		</Modal>
	);
}
