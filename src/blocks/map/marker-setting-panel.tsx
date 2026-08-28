import {
	Button,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import type { MapMarker } from './types';
import { __ } from '@wordpress/i18n';
import { CustomPanelBody } from 'getwid-components';

type MarkerSettingsPanelProps = {
	marker: MapMarker;
	onEdit: ( marker: Partial< MapMarker > ) => void;
	onClose: () => void;
	onOpen: () => void;
	onUpdate: () => void;
	onDelete: () => void;
};

export function MarkerSettingsPanel( props: MarkerSettingsPanelProps ) {
	const { marker, onEdit, onClose, onOpen, onUpdate, onDelete } = props;

	return (
		<CustomPanelBody
			title={ `${ __( 'Marker', 'getwid' ) }: ${ marker.name }` }
			initialOpen={ false }
			onOpen={ onOpen }
			onClose={ onClose }
		>
			<TextControl
				label={ __( 'Name', 'getwid' ) }
				value={ marker.name }
				onChange={ ( value ) => onEdit( { name: value } ) }
				__nextHasNoMarginBottom
			/>
			<TextareaControl
				label={ __( 'Popup Content. Plain Text or HTML.', 'getwid' ) }
				rows={ 5 }
				value={ marker.description }
				onChange={ ( value ) => onEdit( { description: value } ) }
			/>
			<ToggleControl
				label={ __( 'Opened by default', 'getwid' ) }
				checked={ marker.popUpOpen }
				onChange={ ( value ) => onEdit( { popUpOpen: value } ) }
			/>
			<TextControl
				label={ __( 'Popup Width', 'getwid' ) }
				value={ String( marker.popUpMaxWidth ) }
				type="number"
				onChange={ ( value ) => onEdit( { popUpMaxWidth: value } ) }
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={ __( 'Latitude', 'getwid' ) }
				value={ String( marker.coords.lat ) }
				type="number"
				onChange={ ( value ) =>
					onEdit( {
						coords: {
							lat: parseFloat( value ),
							lng: marker.coords.lng,
						},
					} )
				}
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={ __( 'Longitude', 'getwid' ) }
				value={ String( marker.coords.lng ) }
				type="number"
				onChange={ ( value ) =>
					onEdit( {
						coords: {
							lat: marker.coords.lat,
							lng: parseFloat( value ),
						},
					} )
				}
				__nextHasNoMarginBottom
			/>
			<Button variant="primary" onClick={ onUpdate }>
				{ __( 'Update', 'getwid' ) }
			</Button>
			<Button variant="secondary" onClick={ onDelete }>
				{ __( 'Delete', 'getwid' ) }
			</Button>
		</CustomPanelBody>
	);
}
