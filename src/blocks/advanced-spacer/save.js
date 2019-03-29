/**
* External dependencies
*/
import classnames from "classnames";
import './style.scss'


/**
* WordPress dependencies
*/
const {__} = wp.i18n;
const {Component} = wp.element;


/**
* Component Output
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				height,
                isHideDesktop,
                isHideTablet,
                isHideMobile,
			},
            className
		} = this.props;

		return <div
            className={ classnames(
                className, {
                    'getwid-hide-desktop': isHideDesktop,
                    'getwid-hide-tablet' : isHideTablet,
                    'getwid-hide-mobile' : isHideMobile,
                }
            ) }
			style={ { height } } aria-hidden />;
	}
}

export default (Save);