import Modal from './templates-modal';
import './editor.scss';

import { __ } from 'wp.i18n';
const { ToolbarButton, ToolbarGroup, BaseControl, Button } = wp.components;
const { useState } = wp.element;

export const TemplateSelectControl = ( props ) => {

	const [ modalIsOpen, setModalIsOpen ] = useState( false );

	return (
		<BaseControl
			label={ __( 'Post Template', 'getwid' ) }
		>
			<div>
				<Button
					variant="primary"
					onClick={ () => setModalIsOpen( true ) }
				>
					{ __( 'Select Template', 'getwid' ) }
				</Button>
			</div>
			{ modalIsOpen && (
				<Modal
					{ ...props }
					onClose={ () => setModalIsOpen( false ) }
				/>
			) }
		</BaseControl>
	)
}

export const TemplateSelectToolbarButton = ( props ) => {

	const [ modalIsOpen, setModalIsOpen ] = useState( false );

	return (
		<ToolbarGroup>
			<ToolbarButton
				onClick={ () => setModalIsOpen( true ) }
			>
				{ __( 'Select Template', 'getwid' ) }
			</ToolbarButton>
			{ modalIsOpen && (
				<Modal
					{ ...props }
					onClose={ () => setModalIsOpen( false ) }
				/>
			) }
		</ToolbarGroup>
	)
}
