/**
* External dependencies
*/
import classnames from 'classnames';

const { RichText } = wp.editor;
const { InnerBlocks } = wp.editor;
const { Component, Fragment } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}
	
	render() {
		const { url, meta } = this.props.attributes;
		const { className, baseClass } = this.props;
		
		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__card`}>
							<div className={`${baseClass}__card-inner`}>
								{ url && ( <div className={`${baseClass}__image-wrapper`}>
										<img className={`${baseClass}__image`} src={url} alt={''}/>
									</div>
								) }								
								<div className={`${baseClass}__content-wrapper`}>
									<InnerBlocks.Content/>
								</div>
							</div>

							<div className={`${baseClass}__card-arrow`}></div>
						</div>

						<div className={`${baseClass}__point`}>
							<div className={`${baseClass}__point-content`}></div>
						</div>						

						<div className={`${baseClass}__meta`}>
							{
								meta && ( <RichText.Content
									tagName={ 'p' }
									className={ `${baseClass}__meta-content` }
									value={ meta }
								/> )
							}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;