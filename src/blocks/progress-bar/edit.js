/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import { isInViewport, scrollHandler, getScrollableClassName } from 'GetwidUtils/help-functions';
import './editor.scss';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

		const { isAnimated } = this.props.attributes;

		this.drawFrame  = this.drawFrame.bind( this );
		this.drawLinearBar  = this.drawLinearBar.bind( this );

		this.state = {
			fillComplete: !$.parseJSON(isAnimated) ? true : false,
			holderWidth: undefined
		}
	}

	drawFrame() {
		const { clientId } = this.props;

		const { baseClass } = this.props;
		const { fillAmount } = this.props.attributes;

		const thisBlock = $( `[data-block='${clientId}']` );
		let $content = $( `.${baseClass}__progress`, thisBlock );

		const percent = () => { return Math.round(( $content.width()/$content.parent().width() ) * 100); }

		$content.animate({ width: `${fillAmount}%` }, {
			duration: 2000,
			progress: () => {
				let $percent = $(`.${baseClass}__percent`, thisBlock);
				$percent.text(percent() + '%');
			},
			complete: () => {
				this.setState({
					fillComplete: true,
					holderWidth: $content.parent().width()
				});
			}
		});
	}

	drawLinearBar() {
		const { baseClass, clientId } = this.props;
		const { isAnimated, fillAmount } = this.props.attributes;

		const thisBlock = $( `[data-block='${clientId}']` );
		const $bar = $( `.${baseClass}__progress`, thisBlock );

		const root = getScrollableClassName();

		if ( $.parseJSON( isAnimated ) ) {
			if ( isInViewport( $bar ) ) {
				this.drawFrame( $bar );
			} else {
				scrollHandler( `.${root}`, $bar, () => {
					this.drawFrame( $bar );
				});
			}
		} else {
			$( `.${baseClass}__progress`, thisBlock ).css( 'width', `${fillAmount}%` );
			$( `.${baseClass}__percent` , thisBlock ).text( `${fillAmount}%` );
		}
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {

			const { baseClass, clientId } = this.props;
			const { isAnimated, fillAmount } = this.props.attributes;

			const value = fillAmount ? fillAmount : '0';

			if ( !$.parseJSON( isAnimated ) ) {
				$( `.${clientId}`).find(`.${baseClass}__progress`).css('width', `${value}%` );
			}

			if ( !isEqual( prevProps.attributes, this.props.attributes ) ) {
				$(`#block-${clientId}`).find(`.${baseClass}__progress`).css('width', `${value}%`);
				$(`#block-${clientId}`).find(`.${baseClass}__percent`).text(`${value}%`);
			}
		}
	}

	componentDidMount() {
		this.drawLinearBar();
	}

	render() {
		const { backgroundColor } = this.props;
		const { className, setAttributes, baseClass  } = this.props;
		const { title, fillAmount, customTextColor, customBackgroundColor } = this.props.attributes;

		let currentAmount = fillAmount ? parseInt(fillAmount) : 0;

		const { fillComplete, holderWidth } = this.state;

		const contentWrapperPropds = {
			className: classnames(`${baseClass}__bar`),
			style: {
				backgroundColor: backgroundColor.color ? backgroundColor.color : customBackgroundColor
			}
		};

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={className}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__header`}>

							<RichText
								tagName='p'
								className={`${baseClass}__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>
							<span className={`${baseClass}__percent`}> {
									`${fillAmount ? fillAmount : '0'}%`
								}
							</span>
						</div>

						<div {...contentWrapperPropds}>
							<div className={`${baseClass}__progress`} style={{

								backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
									&& typeof this.props.attributes.textColor.class == 'undefined') ?
									this.props.textColor.color : (customTextColor ? customTextColor : undefined),

								width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
							}}></div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);
