const {Component, Fragment, RawHTML} = wp.element;
import svgList from '../svg-list';

export default class Dividers extends Component {

	render() {

		const {
			attributes: {
				dividersHeight,
				dividerTop,
				dividerTopColor,
				dividerBottom,
				dividerBottomColor,
			},
			baseClass
		} = this.props;

		return (
			<Fragment>
				{
					dividerBottom &&
					<div className={`${baseClass}__divider is-bottom-divider`} >
						{this.renderSVG(dividerBottom, dividerBottomColor, dividersHeight)}
					</div>
				}
				{
					dividerTop &&
					<div className={`${baseClass}__divider is-top-divider`} >
						{this.renderSVG(dividerTop, dividerTopColor, dividersHeight)}
					</div>
				}
			</Fragment>
		);
	}

	renderSVG(type, color, dividersHeight) {
		if (color === undefined) {
			color = 'white';
		}
		return svgList.hasOwnProperty(type) ? svgList[type](color, dividersHeight) : '';
	}
}