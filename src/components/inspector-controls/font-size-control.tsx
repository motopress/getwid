import {
	BaseControl,
	Button,
	SelectControl,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import StyleLengthControl from '../style-length-control';
import './editor.scss';

type FontSizeAttributes = {
	fontSize?: string;
	fontSizeTablet: string;
	fontSizeMobile: string;
};

type FontSizeControlProps = {
	attributes: FontSizeAttributes;
	setAttributes: ( attributes: Partial< FontSizeAttributes > ) => void;
};

const fontSizeOptions = ( prefix: 'fs-tablet' | 'fs-mobile' ) => [
	{ value: `${ prefix }-50`, label: __( '50%', 'getwid' ) },
	{ value: `${ prefix }-60`, label: __( '60%', 'getwid' ) },
	{ value: `${ prefix }-70`, label: __( '70%', 'getwid' ) },
	{ value: `${ prefix }-80`, label: __( '80%', 'getwid' ) },
	{ value: `${ prefix }-90`, label: __( '90%', 'getwid' ) },
	{ value: `${ prefix }-100`, label: __( '100%', 'getwid' ) },
	{ value: `${ prefix }-110`, label: __( '110%', 'getwid' ) },
	{ value: `${ prefix }-120`, label: __( '120%', 'getwid' ) },
];

export default function FontSizeControl( {
	attributes,
	setAttributes,
}: FontSizeControlProps ) {
	const { fontSize, fontSizeTablet, fontSizeMobile } = attributes;

	return (
		<BaseControl className="getwid-font-size-control">
			<BaseControl.VisualLabel>
				{ __( 'Font Size', 'getwid' ) }
			</BaseControl.VisualLabel>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				tabs={ [
					{
						name: 'desktop',
						title: __( 'Desktop', 'getwid' ),
						className: 'components-button is-link is-small',
					},
					{
						name: 'tablet',
						title: __( 'Tablet', 'getwid' ),
						className: 'components-button is-link is-small',
					},
					{
						name: 'mobile',
						title: __( 'Mobile', 'getwid' ),
						className: 'components-button is-link is-small',
					},
				] }
			>
				{ ( tab ) => (
					<>
						{ tab.name === 'desktop' && (
							<StyleLengthControl
								value={ fontSize }
								onChange={ ( nextFontSize ) =>
									setAttributes( { fontSize: nextFontSize } )
								}
							/>
						) }
						{ tab.name === 'tablet' && (
							<SelectControl
								value={ fontSizeTablet }
								onChange={ ( nextFontSizeTablet ) =>
									setAttributes( {
										fontSizeTablet: nextFontSizeTablet,
									} )
								}
								options={ fontSizeOptions( 'fs-tablet' ) }
							/>
						) }
						{ tab.name === 'mobile' && (
							<SelectControl
								value={ fontSizeMobile }
								onChange={ ( nextFontSizeMobile ) =>
									setAttributes( {
										fontSizeMobile: nextFontSizeMobile,
									} )
								}
								options={ fontSizeOptions( 'fs-mobile' ) }
							/>
						) }
					</>
				) }
			</TabPanel>
			<Button
				variant="link"
				onClick={ () =>
					setAttributes( {
						fontSizeTablet: 'fs-tablet-100',
						fontSizeMobile: 'fs-mobile-100',
						fontSize: undefined,
					} )
				}
				disabled={
					! (
						fontSizeTablet !== 'fs-tablet-100' ||
						fontSizeMobile !== 'fs-mobile-100' ||
						fontSize !== undefined
					)
				}
			>
				{ __( 'Reset', 'getwid' ) }
			</Button>
		</BaseControl>
	);
}
