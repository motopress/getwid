/**
* External dependencies
*/
import classnames from 'classnames';

import './style.scss';

const { InnerBlocks, getColorClassName } = wp.blockEditor || wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
        const { className, baseClass } 		 = this.props;
		const { animation, filling } 		 = this.props.attributes;
        const { fillColor, customFillColor } = this.props.attributes;

        const fillClass = getColorClassName( 'background-color', fillColor );

        const barProps = {
			className: classnames( `${baseClass}__bar`,
				{
					'has-background': fillColor || customFillColor,
					[ fillClass ]: fillClass
				} ),
			style: { backgroundColor: fillColor ? undefined : customFillColor }
        };

        const wrapperClasses = {
        	className: classnames(
				className,
				{
					['is-animated']: animation != 'none'
				}
			)
		};

        return (
            <div {...wrapperClasses} data-animation={animation} data-filling={filling}>
                <div className={`${baseClass}__line`}>
                    <div {...barProps}></div>
                </div>
                <div className={`${baseClass}__wrapper`}>
                    <InnerBlocks.Content />
                </div>
            </div>
        );
	}
}

export default Save;
