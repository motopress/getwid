/**
* External dependencies
*/
import classnames from 'classnames';

import './style.scss';

const { InnerBlocks, getColorClassName } = wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}
	
	render() {
        const { className, baseClass } = this.props;
		const { animation, filling } = this.props.attributes;
        const { fillColor, customFillColor } = this.props.attributes;

        const fillClass = getColorClassName( 'background-color', fillColor );

        const wrapperProps = {
			className: classnames( `${baseClass}__bar`,
				{
					'has-background': fillColor || customFillColor,
					[ fillClass ]: fillClass
				} ),
			style: { backgroundColor: fillColor ? undefined : customFillColor }
        };

        return (
            <div className={`${classnames( className )}`} data-animation={animation} data-filling={filling}>
                <div className={`${baseClass}__line`}>
                    <div {...wrapperProps}></div>
                </div>
                <div className={`${baseClass}__wrapper`}>
                    <InnerBlocks.Content/>
                </div>
            </div>
        );
	}
}

export default Save;