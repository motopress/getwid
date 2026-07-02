import {
	BaseControl,
	Button,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import TemplatesModal from './templates-modal';

type TemplateSelectProps = {
	selectedTemplate?: string;
	onSelect: ( templateID: string ) => void;
	previewRender: ( templateID: number ) => JSX.Element;
};

export function TemplateSelectControl( props: TemplateSelectProps ) {
	const [ modalIsOpen, setModalIsOpen ] = useState( false );

	return (
		<BaseControl label={ __( 'Post Template', 'getwid' ) }>
			<div>
				<Button
					variant="primary"
					onClick={ () => setModalIsOpen( true ) }
				>
					{ __( 'Select Template', 'getwid' ) }
				</Button>
			</div>
			{ modalIsOpen && (
				<TemplatesModal
					{ ...props }
					onClose={ () => setModalIsOpen( false ) }
				/>
			) }
		</BaseControl>
	);
}

export function TemplateSelectToolbarButton( props: TemplateSelectProps ) {
	const [ modalIsOpen, setModalIsOpen ] = useState( false );

	return (
		<ToolbarGroup>
			<ToolbarButton onClick={ () => setModalIsOpen( true ) }>
				{ __( 'Select Template', 'getwid' ) }
			</ToolbarButton>
			{ modalIsOpen && (
				<TemplatesModal
					{ ...props }
					onClose={ () => setModalIsOpen( false ) }
				/>
			) }
		</ToolbarGroup>
	);
}
