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
				iconPosition,
				equalHeight
			},
		} = this.props;

        const { className } = this.props;

        return (
			<div className={classnames(className, {
					'has-icon-left': iconPosition === 'left',
					'toggle-equal-height': equalHeight,
				})}
			>
                <InnerBlocks.Content/>
            </div>
        );
	}
}

export default Save;