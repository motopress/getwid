import classnames from 'classnames';
import times from 'lodash/times';
import './editor.scss'
import './style.scss'

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.editor;

class Save extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g,'' );
	}
	render() {
		const {
			attributes: {
				slideCount,
				blockAlignment,
				currentSlide,
				uniqueID,
				sliderArrays,
				iSize
			}
		} = this.props;
		const className = 'wp-block-getwid-content-slider';
		console.info(this.props);
		console.log('++++++++++++')

		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const wrapperClass = classnames( `${className}-tab-id${ classId } ${className}--current-slide-${ currentSlide }` );
		
		// console.warn(slideCount);
		// console.log('SAVE slideCount');
		const renderSaveTitles = ( index ) => {

/*			console.log(index);
			console.log(sliderArrays);
			console.log(typeof sliderArrays[ index ]);*/
			if (typeof sliderArrays[ index ] !== 'undefined')
			return (
				<Fragment>
					<li id={ `tab-${ this.stripStringRender( sliderArrays[ index ].text.toString() ) }` } className={ `${className}__title-wrapper ${className}__title-wrapper-${ index } ${className}__title-wrapper--${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
						<a href={ `#tab-${ this.stripStringRender( sliderArrays[ index ].text.toString() ) }` } data-tab={ 1 + index } className={ `${className}__title ${className}__title-${ 1 + index } ` }>
							{ sliderArrays[ index ].icon && 'right' !== sliderArrays[ index ].iconSide && (
								<i className={ `${ sliderArrays[ index ].icon } icon-side-${ sliderArrays[ index ].iconSide }` } style={{ fontSize: iSize }}></i>
								)
							}
							<RichText.Content
								tagName="span"
								value={ sliderArrays[ index ].text }
								className={`${className}__title_text`}
							/>
							{ sliderArrays[ index ].icon && 'right' === sliderArrays[ index ].iconSide && (
								<i className={ `${ sliderArrays[ index ].icon } icon-side-${ sliderArrays[ index ].iconSide }` } style={{ fontSize: iSize }}></i>
								)
							}
						</a>
					</li>
				</Fragment>
			);
		};
		return (
			<div className={ wrapperClass } >
				<div className={`${className}__slides-wrapper`}>
					<ul className={`${className}__titles`}>
						{ times( slideCount, n => renderSaveTitles( n ) ) }
					</ul>
					<div className={`${className}__content`}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}
export default Save;
