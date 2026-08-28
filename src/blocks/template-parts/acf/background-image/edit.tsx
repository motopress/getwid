import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import { getCustomPaddingStyle, prepareGradientStyle } from './style-utils';
import type { TemplateAcfBackgroundImageEditProps } from './types';

import './editor.scss';
import './style.scss';

const TEMPLATE = [ [ 'core/paragraph' ] ];
const baseClass = 'wp-block-getwid-template-acf-background-image';

function Edit( props: TemplateAcfBackgroundImageEditProps ) {
	const { attributes } = props;
	const {
		minHeight,
		contentMaxWidth,
		foregroundOpacity,
		foregroundColor,
		foregroundFilter,
		verticalAlign,
		verticalAlignTablet,
		verticalAlignMobile,
		horizontalAlign,
		horizontalAlignTablet,
		horizontalAlignMobile,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		paddingTopTablet,
		paddingRightTablet,
		paddingBottomTablet,
		paddingLeftTablet,
		paddingTopMobile,
		paddingRightMobile,
		paddingBottomMobile,
		paddingLeftMobile,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( {
			[ `getwid-padding-top-${ paddingTop }` ]:
				paddingTop !== 'custom' && paddingTop !== '',
			[ `getwid-padding-bottom-${ paddingBottom }` ]:
				paddingBottom !== 'custom' && paddingBottom !== '',
			[ `getwid-padding-left-${ paddingLeft }` ]:
				paddingLeft !== 'custom' && paddingLeft !== '',
			[ `getwid-padding-right-${ paddingRight }` ]:
				paddingRight !== 'custom' && paddingRight !== '',
			[ `getwid-padding-tablet-top-${ paddingTopTablet }` ]:
				paddingTopTablet !== '',
			[ `getwid-padding-tablet-bottom-${ paddingBottomTablet }` ]:
				paddingBottomTablet !== '',
			[ `getwid-padding-tablet-left-${ paddingLeftTablet }` ]:
				paddingLeftTablet !== '',
			[ `getwid-padding-tablet-right-${ paddingRightTablet }` ]:
				paddingRightTablet !== '',
			[ `getwid-padding-mobile-top-${ paddingTopMobile }` ]:
				paddingTopMobile !== '',
			[ `getwid-padding-mobile-bottom-${ paddingBottomMobile }` ]:
				paddingBottomMobile !== '',
			[ `getwid-padding-mobile-left-${ paddingLeftMobile }` ]:
				paddingLeftMobile !== '',
			[ `getwid-padding-mobile-right-${ paddingRightMobile }` ]:
				paddingRightMobile !== '',
			[ `getwid-align-items-${ verticalAlign }` ]:
				verticalAlign !== 'center',
			[ `getwid-align-items-tablet-${ verticalAlignTablet }` ]:
				verticalAlignTablet !== '',
			[ `getwid-align-items-mobile-${ verticalAlignMobile }` ]:
				verticalAlignMobile !== '',
			[ `getwid-justify-content-${ horizontalAlign }` ]:
				horizontalAlign !== 'center',
			[ `getwid-justify-content-tablet-${ horizontalAlignTablet }` ]:
				horizontalAlignTablet !== '',
			[ `getwid-justify-content-mobile-${ horizontalAlignMobile }` ]:
				horizontalAlignMobile !== '',
		} ),
		style: { minHeight },
	} );
	const foregroundClass = clsx( `${ baseClass }__foreground`, {
		[ `getwid-opacity-${ foregroundOpacity }` ]: foregroundOpacity !== 35,
	} );
	const foregroundStyle = {
		backgroundColor: foregroundColor,
		backgroundImage: prepareGradientStyle( attributes ),
		mixBlendMode: foregroundFilter,
	};
	const containerStyle = {
		maxWidth: contentMaxWidth,
		...getCustomPaddingStyle( attributes ),
	};

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div className="components-placeholder editor-media-placeholder wp-block-getwid-template-acf-background-image__image">
					<div className="components-placeholder__label">
						<Dashicon icon="format-image" />
					</div>
					<div className="components-placeholder__instructions">
						{ __( 'ACF Background Image', 'getwid' ) }
					</div>
				</div>
				<div className={ foregroundClass } style={ foregroundStyle } />
				<div
					className={ `${ baseClass }__content` }
					style={ containerStyle }
				>
					<InnerBlocks
						template={ TEMPLATE }
						templateInsertUpdatesSelection={ false }
						templateLock={ false }
					/>
				</div>
			</div>
		</>
	);
}

export default Edit;
