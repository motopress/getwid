const {Component, Fragment, RawHTML} = wp.element;
import svgList from '../svg-list';

export default class Dividers extends Component {

	render() {

		const {
			attributes: {
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
						{this.renderSVG(dividerBottom, dividerBottomColor)}
					</div>
				}
				{
					dividerTop &&
					<div className={`${baseClass}__divider is-top-divider`} >
						{this.renderSVG(dividerTop, dividerTopColor)}
					</div>
				}
			</Fragment>
		);
	}

	renderSVG(type, color) {
		return svgList.hasOwnProperty(type) ? svgList[type](color) : '';
	}
}