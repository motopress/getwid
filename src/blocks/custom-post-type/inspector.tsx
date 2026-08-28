import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CustomQueryControl, TemplateSelectControl } from 'getwid-components';

import type { CustomPostTypeEditProps, ServerSideRenderProps } from './types';

const MAX_POSTS_COLUMNS = 6;
const ServerSideRender = (
	window as unknown as {
		wp?: {
			serverSideRender?: ( props: ServerSideRenderProps ) => JSX.Element;
		};
	}
 ).wp?.serverSideRender;

export default function Inspector( {
	attributes,
	setAttributes,
}: CustomPostTypeEditProps ) {
	const { postTemplate, postLayout, columns, spacing } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Content Settings', 'getwid' ) } initialOpen>
				<CustomQueryControl
					setValues={ setAttributes }
					options={ [ 'page', 'sticky', 'parentFilter' ] }
					values={ attributes }
					onChangeCallback={ () => undefined }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Display Settings', 'getwid' ) }
				initialOpen={ false }
			>
				<TemplateSelectControl
					selectedTemplate={ postTemplate }
					onSelect={ ( templateID ) =>
						setAttributes( { postTemplate: templateID } )
					}
					previewRender={ ( templateID ) =>
						ServerSideRender ? (
							<ServerSideRender
								block="getwid/custom-post-type"
								attributes={ {
									...attributes,
									postTemplate: String( templateID ),
								} }
							/>
						) : (
							<Fragment />
						)
					}
				/>
				<SelectControl
					label={ __( 'Layout', 'getwid' ) }
					value={ postLayout }
					onChange={ ( nextPostLayout ) =>
						setAttributes( { postLayout: nextPostLayout } )
					}
					options={ [
						{ value: 'list', label: __( 'List', 'getwid' ) },
						{ value: 'grid', label: __( 'Grid', 'getwid' ) },
					] }
				/>
				{ postLayout === 'grid' && (
					<RangeControl
						label={ __( 'Columns', 'getwid' ) }
						value={ columns }
						onChange={ ( nextColumns ) =>
							setAttributes( { columns: nextColumns || 1 } )
						}
						min={ 1 }
						max={ MAX_POSTS_COLUMNS }
					/>
				) }
				<SelectControl
					label={ __( 'Spacing', 'getwid' ) }
					value={ spacing }
					onChange={ ( nextSpacing ) =>
						setAttributes( { spacing: nextSpacing } )
					}
					options={ [
						{ value: 'default', label: __( 'Default', 'getwid' ) },
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{ value: 'small', label: __( 'Small', 'getwid' ) },
						{ value: 'medium', label: __( 'Medium', 'getwid' ) },
						{ value: 'normal', label: __( 'Normal', 'getwid' ) },
						{ value: 'large', label: __( 'Large', 'getwid' ) },
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
