/**
* External dependencies
*/
import classnames from 'classnames';

import './style.scss';

const { InnerBlocks } = wp.blockEditor || wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				active,
				type,
				equalHeight
			},
			baseClass
		} = this.props;

        const { className } = this.props;

        return (
			<div className={classnames(className, {
					[`has-layout-${type}`]: type !== '',
					'tabs-equal-height': equalHeight,
				})}
				data-active-tab={active != undefined ? active : '0' }
			>
				<ul className={`${baseClass}__nav-links`}>

				</ul>
				<div className={`${baseClass}__tabs-wrapper`}>
                	<InnerBlocks.Content/>
				</div>
            </div>
        );
	}
}

export default Save;