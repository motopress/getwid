
/**
* External dependencies
*/
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { Tooltip, Dashicon } = wp.components;

const gradientButton = ({ title, className, firstColor, secondColor, isSelected, onChange }) => {
	const optionButton = (
		<button
			type='button'
			aria-pressed={isSelected}
			className={ classnames(
				`${className}-option`,
				{ 'is-active': isSelected }
			) }
			style={ {
				background: `linear-gradient(90deg, ${firstColor} 0%, ${secondColor} 100%)`
			} }
			onClick={ () => onChange( firstColor, 0, secondColor, 100, 'linear', 90, 'center center' ) }
		/>
	);

	return (
		<div className={`${className}-option-wrapper`}>
			{ title ?
				( <Tooltip text={title}>{optionButton}</Tooltip> ) :
				optionButton
			}
			{ isSelected && <Dashicon icon='saved'/> }
		</div>
	);
}

export default gradientButton;