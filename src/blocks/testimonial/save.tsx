import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { TestimonialAttributes } from './types';

import './style.scss';

const baseClass = 'wp-block-getwid-testimonial';

export default function Save( {
	attributes,
}: BlockSaveProps< TestimonialAttributes > ) {
	const { title, subtitle, content, imgId, imgUrl, imgAlt } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( { 'has-image': imgUrl !== undefined } ),
	} );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__wrapper` }>
				{ ! RichText.isEmpty( content ) && (
					<div className={ `${ baseClass }__content-wrapper` }>
						<RichText.Content
							tagName="p"
							value={ content }
							className={ `${ baseClass }__content` }
						/>
					</div>
				) }
				<div className={ `${ baseClass }__header` }>
					{ imgUrl && (
						<div className={ `${ baseClass }__image-wrapper` }>
							<div className={ `${ baseClass }__image` }>
								<img
									src={ imgUrl }
									alt={ imgAlt }
									className={
										imgId
											? `wp-image-${ imgId }`
											: undefined
									}
								/>
							</div>
						</div>
					) }
					{ ! RichText.isEmpty( title ) &&
						! RichText.isEmpty( subtitle ) && (
							<div className={ `${ baseClass }__heading` }>
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content
										tagName="span"
										value={ title }
										className={ `${ baseClass }__title` }
									/>
								) }
								{ ! RichText.isEmpty( subtitle ) && (
									<RichText.Content
										tagName="span"
										value={ subtitle }
										className={ `${ baseClass }__subtitle` }
									/>
								) }
							</div>
						) }
				</div>
			</div>
		</div>
	);
}
