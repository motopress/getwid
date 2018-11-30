const $ = window.jQuery;

export default function prepareGradientStyle(attrPrefix, props){
	let type = props.attributes[`${attrPrefix}GradientType`],
		angle = props.attributes[`${attrPrefix}GradientAngle`],
		firstColor = props.attributes[`${attrPrefix}GradientFirstColor`],
		secondColor = props.attributes[`${attrPrefix}GradientSecondColor`],
		firstLocation = props.attributes[`${attrPrefix}GradientFirstColorLocation`],
		secondLocation = props.attributes[`${attrPrefix}GradientSecondColorLocation`];

	angle = angle !== undefined ? `${angle}deg` : '180deg';
	firstColor = firstColor !== undefined ? firstColor : 'rgba(0,0,0,0)';
	firstLocation = firstLocation !== undefined ? `${firstLocation}%` : '0%';
	secondColor = secondColor !== undefined ? secondColor : 'rgba(0,0,0,0)';
	secondLocation = secondLocation !== undefined ? `${secondLocation}%` : '100%';

	const style = {};

	switch (type) {
		case 'linear':
			style['backgroundImage'] = `linear-gradient(${angle}, ${firstColor} ${firstLocation}, ${secondColor} ${secondLocation})`;
			break;
		case 'radial':
			style['backgroundImage'] = `radial-gradient(${firstColor} ${firstLocation}, ${secondColor} ${secondLocation})`;
			break;
	}

	return style;
}