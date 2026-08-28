import {
	Button,
	Modal,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import type { MapMarker } from './types';
import { baseClass } from './constants';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

type MarkerModalProps = {
	marker: MapMarker;
	onSave: ( marker: MapMarker ) => void;
	onClose: () => void;
	isUpdating: boolean;
};

export function MarkerModal( props: MarkerModalProps ) {
	const { marker, onClose, onSave, isUpdating } = props;
	const [ draft, setDraft ] = useState( marker );

	return (
		<Modal
			className={ `${ baseClass }__modal` }
			title={ __( 'Edit Marker', 'getwid' ) }
			onRequestClose={ () => {
				onClose();
			} }
		>
			<TextControl
				label={ __( 'Name', 'getwid' ) }
				value={ draft.name }
				onChange={ ( value ) => setDraft( { ...draft, name: value } ) }
				__nextHasNoMarginBottom
			/>
			<TextareaControl
				label={ __( 'Popup Content. Plain Text or HTML.', 'getwid' ) }
				rows={ 5 }
				value={ draft.description }
				onChange={ ( value ) =>
					setDraft( { ...draft, description: value } )
				}
			/>
			<ToggleControl
				label={ __( 'Opened by default', 'getwid' ) }
				checked={ draft.popUpOpen }
				onChange={ ( value ) =>
					setDraft( { ...draft, popUpOpen: value } )
				}
			/>
			<TextControl
				label={ __( 'Popup Maximum Width, px.', 'getwid' ) }
				value={ draft.popUpMaxWidth }
				type="number"
				onChange={ ( value ) =>
					setDraft( { ...draft, popUpMaxWidth: value } )
				}
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={ __( 'Latitude', 'getwid' ) }
				value={ draft.coords.lat }
				type="number"
				onChange={ ( value ) =>
					setDraft( {
						...draft,
						coords: { ...draft.coords, lat: parseFloat( value ) },
					} )
				}
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={ __( 'Longitude', 'getwid' ) }
				value={ draft.coords.lng }
				type="number"
				onChange={ ( value ) =>
					setDraft( {
						...draft,
						coords: { ...draft.coords, lng: parseFloat( value ) },
					} )
				}
				__nextHasNoMarginBottom
			/>
			<Button
				variant="primary"
				onClick={ () => {
					onSave( draft );
				} }
			>
				{ ! isUpdating
					? __( 'Save', 'getwid' )
					: __( 'Update', 'getwid' ) }
			</Button>
			<Button
				variant="secondary"
				onClick={ () => {
					onClose();
				} }
			>
				{ __( 'Cancel', 'getwid' ) }
			</Button>
		</Modal>
	);
}
