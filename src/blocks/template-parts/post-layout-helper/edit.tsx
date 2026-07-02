import {
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock, type BlockInstance } from '@wordpress/blocks';
import { Button, Dashicon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import type { TemplatePostLayoutHelperEditProps } from './types';

import './editor.scss';
import './style.scss';

type LayoutTemplate = {
	title: string;
	icon: JSX.Element;
	layout: BlockInstance[];
};

function getGetwidSettings() {
	return (
		window as unknown as {
			Getwid?: {
				templates?: { name?: string };
			};
		}
	 ).Getwid;
}

function PreviewIcon( {
	variant,
}: {
	variant: 'classic' | 'background' | 'columns' | 'section';
} ) {
	const imageRect =
		variant === 'classic'
			? { x: 3, y: 3, width: 42, height: 22 }
			: variant === 'columns'
			? { x: 3, y: 3, width: 22, height: 42 }
			: { x: 4, y: 4, width: 40, height: 40 };

	return (
		<svg
			width="48"
			height="48"
			viewBox="0 0 48 48"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<rect
				x={ imageRect.x }
				y={ imageRect.y }
				width={ imageRect.width }
				height={ imageRect.height }
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{ variant === 'columns' && (
				<rect
					x="31"
					y="14"
					width="14"
					height="22"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			) }
			{ variant === 'background' && (
				<path
					d="M9 37 17 29l7 6 8-9 7 11"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			) }
			{ variant === 'section' && (
				<path
					d="M8 8h32v32H8zM13 17h22M13 24h22M13 31h16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			) }
			{ variant !== 'background' && variant !== 'section' && (
				<>
					<path
						d="M3 32h26M3 38h42M3 44h30"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					/>
					<circle cx="32" cy="11" r="2" fill="currentColor" />
				</>
			) }
		</svg>
	);
}

function getTemplates(): LayoutTemplate[] {
	return [
		{
			title: __( 'Classic', 'getwid' ),
			icon: <PreviewIcon variant="classic" />,
			layout: [
				createBlock( 'getwid/template-post-featured-image', {
					linkTo: 'post',
				} ),
				createBlock( 'getwid/template-post-title', {
					linkTo: 'post',
					headerTag: 'h3',
				} ),
				createBlock( 'getwid/template-post-meta' ),
				createBlock( 'getwid/template-post-content' ),
				createBlock( 'getwid/template-post-button' ),
			],
		},
		{
			title: __( 'Image in background', 'getwid' ),
			icon: <PreviewIcon variant="background" />,
			layout: [
				createBlock(
					'getwid/template-post-featured-background-image',
					{
						paddingTop: 'large',
						paddingBottom: 'large',
						paddingLeft: 'large',
						paddingRight: 'large',
						foregroundColor: '#000',
						contentMaxWidth: 768,
					},
					[
						createBlock( 'getwid/template-post-title', {
							linkTo: 'post',
							headerTag: 'h3',
							customTextColor: '#fff',
						} ),
						createBlock( 'getwid/template-post-content', {
							customTextColor: '#fff',
						} ),
					]
				),
			],
		},
		{
			title: __( 'Two columns', 'getwid' ),
			icon: <PreviewIcon variant="columns" />,
			layout: [
				createBlock(
					'core/columns',
					{
						linkTo: 'post',
						imageSize: 'post-thumbnail',
					},
					[
						createBlock( 'core/column', {}, [
							createBlock(
								'getwid/template-post-featured-image',
								{
									linkTo: 'post',
								}
							),
						] ),
						createBlock( 'core/column', {}, [
							createBlock( 'getwid/template-post-title', {
								linkTo: 'post',
								headerTag: 'h3',
							} ),
							createBlock( 'getwid/template-post-content' ),
							createBlock( 'getwid/template-post-link', {
								buttonText: 'Continue reading',
							} ),
						] ),
					]
				),
			],
		},
		{
			title: __( 'Custom background', 'getwid' ),
			icon: <PreviewIcon variant="section" />,
			layout: [
				createBlock(
					'getwid/section',
					{
						customBackgroundColor: '#f3f8fb',
						paddingTop: 'large',
						paddingBottom: 'large',
						paddingLeft: 'large',
						paddingRight: 'large',
						verticalAlign: 'flex-start',
						horizontalAlign: 'flex-start',
					},
					[
						createBlock( 'getwid/template-post-title', {
							linkTo: 'post',
							headerTag: 'h3',
						} ),
						createBlock( 'getwid/template-post-content' ),
						createBlock( 'getwid/template-post-link', {
							buttonText: 'Continue reading',
						} ),
					]
				),
			],
		},
	];
}

export default function Edit( {
	className,
	clientId,
}: TemplatePostLayoutHelperEditProps ) {
	const currentPostType = useSelect(
		( select ) =>
			(
				select( 'core/editor' ) as {
					getCurrentPostType: () => string | undefined;
				}
			 ).getCurrentPostType(),
		[]
	);
	const { replaceBlocks } = useDispatch( blockEditorStore ) as {
		replaceBlocks: (
			nextClientId: string,
			blocks: BlockInstance | BlockInstance[]
		) => void;
	};
	const blockProps = useBlockProps( { className } );
	const getwidSettings = getGetwidSettings();

	if ( currentPostType !== getwidSettings?.templates?.name ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			<div className="components-placeholder block-editor-inner-blocks__template-picker has-many-options">
				<div className="components-placeholder__label">
					<Dashicon icon="layout" />
					{ __( 'Choose Layout', 'getwid' ) }
				</div>
				<div className="components-placeholder__instructions">
					{ __(
						'Select a layout to start with, or make one yourself.',
						'getwid'
					) }
				</div>
				<div className="components-placeholder__fieldset">
					<ul className="block-editor-inner-blocks__template-picker-options">
						{ getTemplates().map( ( template ) => (
							<li key={ template.title }>
								<Button
									className="components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"
									onClick={ () =>
										replaceBlocks(
											clientId,
											template.layout
										)
									}
								>
									{ template.icon }
									<span>{ template.title }</span>
								</Button>
							</li>
						) ) }
					</ul>
				</div>
			</div>
		</div>
	);
}
