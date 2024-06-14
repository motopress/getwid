import classnames from 'classnames';

const { Modal, Disabled, Button, Flex } = wp.components;
const { useState, useEffect, useCallback } = wp.element;
const apiFetch = wp.apiFetch;
const { addQueryArgs } = wp.url;
import { __ } from 'wp.i18n';

export default ( props ) => {

	const [ templates, setTemplates ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const { onClose, previewRender, selectedTemplate, onSelect } = props;

	const loadTemplates = useCallback( () => {
		setLoading( true );
		apiFetch( {
			path: addQueryArgs( `/getwid/v1/templates`, { template_name : 'getwid_template_part' } ),
		} )
			.then( ( templates ) => {
				setTemplates( templates );
				setLoading( false );
		} );
	}, [] );

	useEffect( () => {
		loadTemplates();
	}, [] );

	return (
		<Modal
			title={ __( 'Select Template', 'getwid' ) }
			onRequestClose={ () => onClose() }
			isFullScreen={ true }
			className="components-getwid-templates"
			headerActions={
				<Flex
					expanded={ false }
				>
					<Button
						href={ Getwid.templates.new }
						target="_blank"
						variant="primary"
					>{ __( 'Create Template', 'getwid' ) }</Button>
					<Button
						variant="secondary"
						disabled={ !!!selectedTemplate }
						onClick={ () => {
							onClose();
							onSelect( '' );
						} }
					>{ __( 'Use Default Template', 'getwid' ) }</Button>
					<Button
						href={ Getwid.templates.view }
						target="_blank"
						variant="secondary"
					>{ __( 'View All Templates', 'getwid' ) }</Button>
					<Button
						onClick={ loadTemplates }
						isBusy={ loading }
						disabled={ loading }
						variant="secondary"
					>{ __( 'Reload Templates', 'getwid' ) }</Button>
				</Flex>
			}
		>
			<div className="components-getwid-templates__list">
				{ templates?.map( template => {
					return (
						<div
							key={ template.value }
							className={ classnames(
								"components-getwid-templates__template",
								{
									"is-selected": template.value == parseInt( selectedTemplate )
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
									<span className="components-getwid-templates__template-title">{ template.label || `#${ template.value }` }</span>
									<Flex
										expanded={ false }
										justify="flex-end"
										className="components-getwid-templates__template-actions"
									>
										<Button
											variant="primary"
											disabled={ template.value == parseInt( selectedTemplate ) }
											onClick={ () => {
												onClose();
												onSelect( template.value.toString() );
											} }
										>{ __( 'Apply', 'getwid' ) }</Button>
										<Button
											href={ `${ Getwid.templates.edit }${ template.value }&action=edit` }
											target="_blank"
											variant="secondary"
										>{ __( 'Edit', 'getwid' ) }</Button>
									</Flex>
								</Flex>
							</Flex>
						</div>
					)
				} ) }
				{ templates?.length < 1 && (
					<p>{ __( 'No templates found.', 'getwid' ) }</p>
				) }
			</div>
		</Modal>
	)
}
