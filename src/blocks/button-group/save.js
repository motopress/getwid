/**
* External dependencies
*/
import classnames from "classnames";


/**
* WordPress dependencies
*/
const {
	Component
}= wp.element;
const {
	InnerBlocks
} = wp.editor;


/**
* Component Output
*/
class Save extends Component{
	render() {
		const {
			attributes:{
				spacing,

				alignment,
				alignmentTablet,
				alignmentMobile,

				direction,
				directionTablet,
				directionMobile,

				width,
				widthTablet,
				widthMobile,
			}
		} = this.props;


		const wrapperClasses = classnames(
			'wp-block-getwid-button-group__wrapper',
			{
				[`wp-block-getwid-button-group--spacing-${spacing}`]: spacing !== '',

				[`wp-block-getwid-button-group--alignment-${alignment}`]: alignment !== 'left',
				[`wp-block-getwid-button-group--alignment-tablet-${alignmentTablet}`]: alignmentTablet !== '',
				[`wp-block-getwid-button-group--alignment-mobile-${alignmentMobile}`]: alignmentMobile !== '',

				[`wp-block-getwid-button-group--direction-${direction}`]: direction !== 'row',
				[`wp-block-getwid-button-group--direction-tablet-${directionTablet}`]: directionTablet !== '',
				[`wp-block-getwid-button-group--direction-mobile-${directionMobile}`]: directionMobile !== '',

				[`wp-block-getwid-button-group--width-${width}`]: width !== 'auto',
				[`wp-block-getwid-button-group--width-tablet-${widthTablet}`]: widthTablet !== 'auto',
				[`wp-block-getwid-button-group--width-mobile-${widthMobile}`]: widthMobile !== 'auto',
			}
		);

		return (
			<div className={'wp-block-getwid-button-group'}>
				<div className={wrapperClasses}>
					<InnerBlocks.Content/>
				</div>
			</div>
		);
	}
}

export default Save;