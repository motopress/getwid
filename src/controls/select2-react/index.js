/**
 * Getwid Select2
 https://react-select.com/props
 */

import Select from 'GetwidVendor/react-select';

export default function GetwidSelect2Control(props) {
	const controlClassPrefix = 'components-getwid-select2';

	return (
		<div className={controlClassPrefix}>
			<Select
				{...props}
			/>
		</div>
	);
}

/*style: {
    type: 'string',
    default: null,
},*/

// import { components as GetwidSelect2Components } from 'GetwidVendor/react-select';
// import GetwidSelect2Control from 'GetwidControls/select2-react';

/*
const { Option:GetwidSelect2Option } = GetwidSelect2Components;
				
const selectLabelRender = (props) => {
	return (
	    <GetwidSelect2Option {...props}>
	    <div><img src={`http://maps.google.com/mapfiles/ms/icons/${props.data.value}.png`}/> {props.data.value}</div>
	    	
	    </GetwidSelect2Option>
	)
};

const selectStyles = {
	menuList: (base) => ({
		...base,
		height: 200,
	}),
};

<GetwidSelect2Control
	className={`${className}__select2`}
	styles={selectStyles}
	label={ __( 'Marker Icon', 'getwid' ) }
	value={ markersArrays[ index ].markerIcon != '' ? JSON.parse( markersArrays[ index ].markerIcon ) : '' }
	options={[
		{value: 'default', label: __('Just Icon', 'getwid')},
		{value: 'stacked', label: __('With Background', 'getwid')},
		{value: 'framed', label: __('With Frame Border', 'getwid')},
	]}
	isMulti={false}
	menuPlacement={'top'}
	components={{ Option: selectLabelRender }}
	onChange={ value => {
		updateArrValues( { markerIcon: JSON.stringify(value) }, index );
	} }
/>
*/