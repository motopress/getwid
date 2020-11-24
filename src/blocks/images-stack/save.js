/**
* Internal dependencies
*/
import {
	chunk,
} from 'lodash';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';
const { Component, Fragment } = wp.element;


/**
 * Module Constants
 */
const baseClass = 'wp-block-getwid-images-stack';


/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes:{
				align,
				images,
				ids,
				linkTo,
				imageSize,
				stackStyle,
				stackOverlap,
				className,
			},
		} = this.props;

		const containerClasses = classnames(
			className,
			{
				[ `is-layout-${stackStyle}` ]: stackStyle != 'default',
			},
			align ? `align${ align }` : null,
		);

		const arr_chunks = chunk(images, 3);

		return (
			<div className={ containerClasses }>
				<div className={`${baseClass}__wrapper`}>
					{ arr_chunks.map((chunk, index) => {

						return (
							<div className={`${baseClass}__chunk`}>
								{ chunk.map( ( image ) => {
									let href;

									switch ( linkTo ) {
										case 'media':
											href = image.original_url;
											break;
										case 'attachment':
											href = image.link;
											break;
									}

									const imageClasses = classnames(
										`${baseClass}__media`,
										image.id ? `wp-image-${ image.id }` : ''
									);
									 const img = <img className={imageClasses} src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link }/>;

									return (
										<div key={ image.id || image.url } className={`${baseClass}__media-wrapper`}>
											<div className={`${baseClass}__media-inner-wrapper`}>
												<Fragment>
													{ href ? <a href={ href }>{ img }</a> : img }
												</Fragment>
											</div>
										</div>
									);

								} ) }
							</div>
						);

					} ) }
				</div>
			</div>
		);
	}
}
export default Save;