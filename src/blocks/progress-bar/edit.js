/**
* External dependencies
*/
import { __ } from 'wp.i18n';
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
const { Component, Fragment, createRef } = wp.element;
const { RichText, withColors } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

		const { isAnimated } = this.props.attributes;

		this.progressBarRef = createRef();

		this.animateProgress  = this.animateProgress.bind( this );
		this.drawLinearBar  = this.drawLinearBar.bind( this );

		this.state = {
			fillComplete: !JSON.parse( isAnimated ) ? true : false,
			holderWidth: undefined
		}
	}

	animateProgress( $progressBar ) {

		const { baseClass } = this.props;
		const { fillAmount } = this.props.attributes;

		const percent = () => { return Math.round(( $progressBar.width()/$progressBar.parent().width() ) * 100); }

		$progressBar.width( 0 );

		$progressBar.animate({ width: `${fillAmount}%` }, {
			duration: 2000,
			progress: () => {
				let $percent = $(`.${baseClass}__percent`, $progressBar.closest('.wp-block-getwid-progress-bar'));
				$percent.text(percent() + '%');
			},
			complete: () => {
				this.setState({
					fillComplete: true,
					holderWidth: $progressBar.parent().width()
				});
			}
		});
	}

	drawLinearBar() {
		const { baseClass } = this.props;
		const { isAnimated, fillAmount } = this.props.attributes;

		const thisBlock = $( this.progressBarRef.current );
		const $bar = $( `.${baseClass}__progress`, thisBlock );

		if ( JSON.parse( isAnimated ) ) {
			this.animateProgress( $bar );
		} else {
			$( `.${baseClass}__progress`, thisBlock ).css( 'width', `${fillAmount}%` );
			$( `.${baseClass}__percent` , thisBlock ).text( `${fillAmount}%` );
		}
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {

			const { baseClass } = this.props;
			const { fillAmount, isAnimated } = this.props.attributes;

			const value = fillAmount ? fillAmount : '0';

			if ( prevProps.attributes.fillAmount !== fillAmount ) {
				$( this.progressBarRef.current ).find(`.${baseClass}__progress`).css('width', `${value}%`);
				$( this.progressBarRef.current ).find(`.${baseClass}__percent`).text(`${value}%`);
			}

			if ( prevProps.attributes.isAnimated !== isAnimated && isAnimated === 'true' ) {
				const $bar = $( `.${baseClass}__progress`, this.progressBarRef.current );
				this.animateProgress( $bar );
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
				<div className={className} ref={ this.progressBarRef }>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__header`}>

							<RichText
								tagName='p'
								className={`${baseClass}__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								multiline={false}
								allowedFormats={allowedFormats}
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
