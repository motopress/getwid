import {
	InnerBlocks,
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import classnames from 'classnames';

import { itemBaseClass } from '../content-timeline/constants';
import type { ContentTimelineItemAttributes } from '../content-timeline/types';

export default function Save( {
	attributes,
}: BlockSaveProps< ContentTimelineItemAttributes > ) {
	const { id, url, meta, cardPosition, outerParent } = attributes;
	const outerAttributes = outerParent?.attributes || {};
	const customBackgroundColor = outerAttributes.customBackgroundColor;
	const backgroundColor = outerAttributes.backgroundColor;
	const pointColor = outerAttributes.pointColor;
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const blockProps = useBlockProps.save( {
		className: classnames( {
			'has-card-left': cardPosition === 'left',
			'has-card-right': cardPosition === 'right',
		} ),
		style: {
			marginBottom: outerAttributes.marginBottom,
		},
	} );
	const contentWrapperStyle = {
		paddingTop: outerAttributes.paddingTop,
		paddingBottom: outerAttributes.paddingBottom,
		paddingLeft: outerAttributes.paddingLeft,
		paddingRight: outerAttributes.paddingRight,
	};
	const cardClass = classnames( `${ itemBaseClass }__card`, {
		'has-background': backgroundColor || customBackgroundColor,
		[ backgroundClass || '' ]: backgroundClass,
	} );
	const pointStyle = {
		marginLeft: outerAttributes.horizontalSpace,
		marginRight: outerAttributes.horizontalSpace,
	};

	return (
		<div { ...blockProps }>
			<div className={ `${ itemBaseClass }__wrapper` }>
				<div
					className={ cardClass }
					style={ {
						backgroundColor: ! backgroundColor
							? customBackgroundColor
							: undefined,
					} }
				>
					<div className={ `${ itemBaseClass }__card-wrapper` }>
						{ url && (
							<div
								className={ `${ itemBaseClass }__image-wrapper` }
							>
								<img
									className={ `${ itemBaseClass }__image ${
										id ? `wp-image-${ id }` : ''
									}` }
									src={ url }
									alt=""
								/>
							</div>
						) }
						<div
							className={ `${ itemBaseClass }__content-wrapper` }
							style={ contentWrapperStyle }
						>
							{ meta && (
								<div
									className={ `${ itemBaseClass }__mobile-meta` }
								>
									<RichText.Content
										tagName="p"
										className={ `${ itemBaseClass }__meta-content` }
										value={ meta }
									/>
								</div>
							) }
							<InnerBlocks.Content />
						</div>
					</div>
				</div>

				<div
					className={ `${ itemBaseClass }__point` }
					style={ pointStyle }
					data-point-color={ pointColor }
				>
					<div className={ `${ itemBaseClass }__point-content` } />
				</div>

				<div className={ `${ itemBaseClass }__meta` }>
					{ meta && (
						<RichText.Content
							tagName="p"
							className={ `${ itemBaseClass }__meta-content` }
							value={ meta }
						/>
					) }
				</div>
			</div>
		</div>
	);
}
