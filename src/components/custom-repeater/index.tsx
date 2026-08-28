import { Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import './editor.scss';

type CustomRepeaterProps = {
	arrayData: string[];
	placeholder?: string;
};

const controlClassPrefix = 'components-getwid-custom-repeater-control';

export default function CustomRepeater( {
	arrayData,
	placeholder,
}: CustomRepeaterProps ) {
	const [ items, setItems ] = useState( arrayData );

	function updateItems( nextItems: string[] ) {
		arrayData.splice( 0, arrayData.length, ...nextItems );
		setItems( [ ...nextItems ] );
	}

	return (
		<div
			className={ clsx( 'components-base-control', controlClassPrefix ) }
		>
			{ items.map( ( item, index ) => (
				<div
					key={ index }
					className={ clsx( `${ controlClassPrefix }__custom-group`, {
						initial: index === 0,
					} ) }
				>
					<TextControl
						placeholder={ placeholder }
						value={ item }
						onChange={ ( value ) => {
							const nextItems = [ ...items ];
							nextItems[ index ] = value;
							updateItems( nextItems );
						} }
					/>
					{ index === 0 ? (
						<Button
							size="small"
							className={ `${ controlClassPrefix }__add-btn` }
							onClick={ () => updateItems( [ ...items, '' ] ) }
						>
							{ __( 'Add Value', 'getwid' ) }
						</Button>
					) : (
						<Button
							label={ __( 'Remove Value', 'getwid' ) }
							className={ `${ controlClassPrefix }__remove-btn` }
							onClick={ () =>
								updateItems(
									items.filter(
										( _nextItem, nextIndex ) =>
											nextIndex !== index
									)
								)
							}
						>
							-
						</Button>
					) }
				</div>
			) ) }
		</div>
	);
}
