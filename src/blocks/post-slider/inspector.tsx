import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	CustomQueryControl,
	StyleLengthControl,
	TemplateSelectControl,
} from 'getwid-components';

import type { PostSliderEditProps } from './types';
import { ServerSideRender } from '@wordpress/server-side-render';

const defaults = {
	sliderAnimationEffect: 'slide',
	sliderAutoplay: false,
	sliderAutoplaySpeed: '6000',
	sliderInfinite: true,
	sliderAnimationSpeed: '800',
};

export default function Inspector( {
	attributes,
	setAttributes,
}: PostSliderEditProps ) {
	const {
		postTemplate,
		postsToShow,
		offset,
		ignoreSticky,
		filterById,
		excludeById,
		excludeCurrentPost,
		childPagesCurrentPage,
		parentPageId,
		postType,
		taxonomy,
		terms,
		relation,
		order,
		orderBy,
		minHeight,
		sliderAnimationEffect,
		sliderAutoplay,
		sliderPauseOnHover,
		sliderAutoplaySpeed,
		sliderInfinite,
		sliderAnimationSpeed,
		sliderArrows,
		sliderDots,
		metaQuery,
	} = attributes;
	const hasSliderSettings =
		sliderAnimationEffect !== defaults.sliderAnimationEffect ||
		sliderAutoplay !== defaults.sliderAutoplay ||
		sliderAutoplaySpeed !== defaults.sliderAutoplaySpeed ||
		sliderInfinite !== defaults.sliderInfinite ||
		sliderAnimationSpeed !== defaults.sliderAnimationSpeed;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Content Settings', 'getwid' ) } initialOpen>
				<CustomQueryControl
					setValues={ setAttributes }
					options={ [ 'sticky', 'parentFilter' ] }
					values={ {
						postsToShow,
						offset,
						ignoreSticky,
						postType,
						filterById,
						excludeById,
						excludeCurrentPost,
						childPagesCurrentPage,
						parentPageId,
						taxonomy,
						terms,
						relation,
						order,
						orderBy,
						metaQuery,
					} }
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
					previewRender={ ( templateID ) => (
						<ServerSideRender
							block="getwid/post-slider"
							attributes={ {
								...attributes,
								postTemplate: String( templateID ),
							} }
						/>
					) }
				/>
				<StyleLengthControl
					label={ __( 'Slider Minimum Height', 'getwid' ) }
					value={ minHeight }
					units={ [
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' },
						{ label: '%', value: '%' },
					] }
					onChange={ ( nextMinHeight ) =>
						setAttributes( { minHeight: nextMinHeight } )
					}
				/>
				<RadioControl
					label={ __( 'Animation Effect', 'getwid' ) }
					selected={ sliderAnimationEffect }
					options={ [
						{ value: 'slide', label: __( 'Slide', 'getwid' ) },
						{ value: 'fade', label: __( 'Fade', 'getwid' ) },
					] }
					onChange={ ( value ) =>
						setAttributes( { sliderAnimationEffect: value } )
					}
				/>
				<ToggleControl
					label={ __( 'Enable Slideshow', 'getwid' ) }
					help={ __( 'Slideshow plays automatically.', 'getwid' ) }
					checked={ sliderAutoplay }
					onChange={ () =>
						setAttributes( {
							sliderAutoplay: ! sliderAutoplay,
						} )
					}
				/>
				{ sliderAutoplay && (
					<>
						<TextControl
							label={ __( 'Slideshow Speed', 'getwid' ) }
							type="number"
							value={ String( sliderAutoplaySpeed ) }
							min={ 0 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderAutoplaySpeed: value,
								} )
							}
						/>
						<ToggleControl
							label={ __( 'Pause On Hover', 'getwid' ) }
							help={ __(
								'Pause the slideshow when the mouse cursor is over a slider.',
								'getwid'
							) }
							checked={ sliderPauseOnHover }
							onChange={ () =>
								setAttributes( {
									sliderPauseOnHover: ! sliderPauseOnHover,
								} )
							}
						/>
					</>
				) }
				<ToggleControl
					label={ __( 'Infinite', 'getwid' ) }
					checked={ sliderInfinite }
					onChange={ () =>
						setAttributes( {
							sliderInfinite: ! sliderInfinite,
						} )
					}
				/>
				<TextControl
					label={ __( 'Animation Speed', 'getwid' ) }
					type="number"
					value={ String( sliderAnimationSpeed ) }
					min={ 0 }
					onChange={ ( value ) =>
						setAttributes( {
							sliderAnimationSpeed: value,
						} )
					}
				/>
				<BaseControl __nextHasNoMarginBottom>
					<Button
						variant="link"
						onClick={ () => setAttributes( defaults ) }
						disabled={ ! hasSliderSettings }
					>
						{ __( 'Reset', 'getwid' ) }
					</Button>
				</BaseControl>
				<PanelBody
					title={ __( 'Controls Settings', 'getwid' ) }
					initialOpen={ false }
				>
					<RadioControl
						label={ __( 'Arrows', 'getwid' ) }
						selected={ sliderArrows }
						options={ [
							{
								value: 'outside',
								label: __( 'Outside', 'getwid' ),
							},
							{
								value: 'inside',
								label: __( 'Inside', 'getwid' ),
							},
							{ value: 'none', label: __( 'None', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { sliderArrows: value } )
						}
					/>
					<RadioControl
						label={ __( 'Dots', 'getwid' ) }
						selected={ sliderDots }
						options={ [
							{
								value: 'outside',
								label: __( 'Outside', 'getwid' ),
							},
							{
								value: 'inside',
								label: __( 'Inside', 'getwid' ),
							},
							{ value: 'none', label: __( 'None', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { sliderDots: value } )
						}
					/>
				</PanelBody>
			</PanelBody>
		</InspectorControls>
	);
}
