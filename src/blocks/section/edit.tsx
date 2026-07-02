import {
	BlockAlignmentToolbar,
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { baseClass } from './constants';
import Inspector from './inspector';
import type { SectionEditProps } from './types';

import './editor.scss';
import './style.scss';

const template = [
	[
		'core/paragraph',
		{
			placeholder: __( 'Write text…', 'getwid' ),
		},
	],
];

export default function Edit( props: SectionEditProps ) {
	const { attributes, setAttributes, className } = props;
	const {
		align,
		contentMaxWidth,
		contentMaxWidthPreset,
		minHeight,
		gapSize,
		verticalAlign,
		horizontalAlign,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, align ? `align${ align }` : null, {
			[ `has-inner-blocks-gap-${ gapSize }` ]:
				gapSize !== undefined && gapSize !== '',
			'getwid-section-content-full-width':
				contentMaxWidthPreset === 'full',
			'getwid-section-content-custom-width':
				contentMaxWidthPreset === 'custom',
		} ),
	} );
	const wrapperClassName = clsx( `${ baseClass }__wrapper`, {
		[ `getwid-align-items-${ verticalAlign }` ]: verticalAlign !== 'center',
		[ `getwid-justify-content-${ horizontalAlign }` ]:
			horizontalAlign !== 'center',
	} );

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					controls={ [ 'wide', 'full' ] }
					onChange={ ( nextAlign ) =>
						setAttributes( { align: nextAlign } )
					}
				/>
			</BlockControls>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div
					className={ wrapperClassName }
					style={ {
						minHeight,
					} }
				>
					<div
						className={ `${ baseClass }__inner-wrapper` }
						style={ {
							maxWidth:
								contentMaxWidth &&
								contentMaxWidthPreset === 'custom'
									? `${ contentMaxWidth }px`
									: undefined,
						} }
					>
						<div className={ `${ baseClass }__content` }>
							<div className={ `${ baseClass }__inner-content` }>
								<InnerBlocks template={ template } />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
