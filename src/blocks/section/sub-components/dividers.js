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

		const dividerTopStyle = {
			background: dividerTopColor
		};

		const dividerBottomStyle = {
			background: dividerBottomColor
		};

		return (
			<Fragment>
				{
					dividerBottom &&
					<div className={`${baseClass}__divider is-bottom-divider`} style={dividerBottomStyle}>
						{this.renderSVG(dividerBottom)}
					</div>
				}
				{
					dividerTop &&
					<div className={`${baseClass}__divider is-top-divider`}
					     style={dividerTopStyle}>
						{this.renderSVG(dividerTop)}
					</div>
				}
			</Fragment>
		);
	}

	renderSVG(type) {
		return svgList.hasOwnProperty(type) ? (<RawHTML>{svgList[type]}</RawHTML>) : '';
	}
}