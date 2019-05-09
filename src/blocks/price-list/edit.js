import Inspector from './inspector';

import { get } from "lodash";
import { __, _x } from 'wp.i18n';

import './editor.scss';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;

const { RichText, withColors, MediaUpload } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				title,
				amount,
				currency,
				description,

				url,
				id,
				titleTag,				
				customTextColor
			},

			className,
			baseClass,

			textColor,

			setAttributes

		} = this.props;

		const textStyle = {
			color: textColor.color !== undefined ? textColor.color : customTextColor ? customTextColor : undefined
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={`${className}`}>
					{
						<MediaUpload
							onSelect={ (image) => {
								setAttributes({
									id: get( image, 'id'),
									url: get( image, [ 'sizes', 'thumbnail', 'url' ] )
								});
							} }
							allowedTypes={['image']}
							gallery
							value={ id ? id : null }
							render={({ open }) => (

								<div className={`${baseClass}__image-wrapper`}>
									{
										url && <div
											className={`${baseClass}__image`} onClick={open}
										>
											<img src={url}/>
										</div>										
									}

									{
										!url && <div
											className={`${baseClass}__upload`} onClick={open}
										>
											Open Media Library
										</div>
									}
								</div>
							)}
						/>
					}				

					<div className={`${baseClass}__content-wrapper`}>
						<div className={`${baseClass}__title-wrapper`}>

							<RichText
								tagName={titleTag}
								className={`${baseClass}__title`}
								placeholder={__('Write title…', 'getwid')}
								value={title ? title : ''}

								onChange={title => {
									setAttributes({ title });
								}}

								keepPlaceholderOnFocus={true}
								style={textStyle}
								multiline={false}
							/>

							<div className={`${baseClass}__price-line`} style={textStyle}></div>

							<RichText
								tagName={titleTag}
								className={`${baseClass}__currency`}
								placeholder={_x('$', 'Price List placeholder', 'getwid')}
								value={currency ? currency : ''}

								onChange={currency => {
									setAttributes({ currency });
								}}

								keepPlaceholderOnFocus={true}
								style={textStyle}
								multiline={false}
							/>

							<RichText
								tagName={titleTag}
								className={`${baseClass}__amount`}
								placeholder={_x('19.99', 'Amount List placeholder', 'getwid')}
								value={amount ? amount : ''}

								onChange={amount => {
									setAttributes({ amount });
								}}

								keepPlaceholderOnFocus={true}
								style={textStyle}
								multiline={false}
							/>

						</div>

						<RichText
							tagName='p'
							className={`${baseClass}__description`}
							placeholder={__('Write description…', 'getwid')}
							value={description ? description : ''}

							onChange={description => {
								setAttributes({ description });
							}}

							keepPlaceholderOnFocus={true}
							style={textStyle}
							multiline={false}
						/>
					</div>

				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);