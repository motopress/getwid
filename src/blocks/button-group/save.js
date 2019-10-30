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
} = wp.blockEditor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-button-group';


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

				className,
			}
		} = this.props;


		const wrapperClasses = classnames(
			`${baseClass}__wrapper`,
			{
				[`has-spacing-${spacing}`]: spacing !== '',

				[`has-alignment-${alignment}`]: alignment !== 'left',
				[`has-alignment-tablet-${alignmentTablet}`]: alignmentTablet !== '',
				[`has-alignment-mobile-${alignmentMobile}`]: alignmentMobile !== '',

				[`has-direction-${direction}`]: direction !== 'row',
				[`has-direction-tablet-${directionTablet}`]: directionTablet !== '',
				[`has-direction-mobile-${directionMobile}`]: directionMobile !== '',

				[`has-width-${width}`]: width !== 'auto',
				[`has-width-tablet-${widthTablet}`]: widthTablet !== 'auto',
				[`has-width-mobile-${widthMobile}`]: widthMobile !== 'auto',
			}
		);

		return (
			<div className={className}>
				<div className={wrapperClasses}>
					<InnerBlocks.Content/>
				</div>
			</div>
		);
	}
}

export default Save;