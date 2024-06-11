import classnames from 'classnames';

const { Modal, Disabled, Button, Flex } = wp.components;
const { useMemo } = wp.element;
const { useSelect } = wp.data;
import { __ } from 'wp.i18n';

export default ( props ) => {

	const { onClose, previewRender, selectedTemplate, onSelect } = props;

	const rawTemplates = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords(
			'postType',
			'getwid_template_part',
			{
				per_page: -1,
			}
		);
	}, [] );

	const templates = useMemo( () => {
		return rawTemplates?.map( template => ( {
			id: template.id,
			title: template.title
		} ) );
	}, [ rawTemplates ] );

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
						variant="secondary"
						disabled={ !!!selectedTemplate }
						onClick={ () => {
							onClose();
							onSelect( '' );
						} }
					>{ __( 'Use Default', 'getwid' ) }</Button>
					<Button
						href={ Getwid.templates.new }
						target="_blank"
						variant="primary"
					>{ __( 'New', 'getwid' ) }</Button>
					<Button
						href={ Getwid.templates.view }
						target="_blank"
						variant="secondary"
					>{ __( 'View All', 'getwid' ) }</Button>
				</Flex>
			}
		>
			<div className="components-getwid-templates__list">
				{ templates?.map( template => {
					return (
						<div
							key={ template.id }
							className={ classnames(
								"components-getwid-templates__template",
								{
									"is-selected": template.id == parseInt( selectedTemplate )
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
									{ previewRender( template.id ) }
								</Disabled>
								<Flex className="components-getwid-templates__template-footer">
									<span className="components-getwid-templates__template-title">{ template.title.raw || `#${ template.id }` }</span>
									<Flex
										expanded={ false }
										justify="flex-end"
										className="components-getwid-templates__template-actions"
									>
										<Button
											variant="primary"
											onClick={ () => {
												onClose();
												onSelect( template.id.toString() );
											} }
										>{ __( 'Apply', 'getwid' ) }</Button>
										<Button
											href={ `${ Getwid.templates.edit }${ template.id }&action=edit` }
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
