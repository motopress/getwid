const {Component, Fragment} = wp.element;

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
		switch (type) {
			case 'arrow':
				return this.renderArrowSVG();
				break;
			case 'arrow-negative':
				return this.renderArrowNegativeSVG();
				break;
			case 'book':
				return this.renderBookSVG();
				break;
			case 'book-negative':
				return this.renderBookNegativeSVG();
				break;
			case 'clouds':
				return this.renderCloudsSVG();
				break;
			case 'clouds-negative':
				return this.renderCloudsNegativeSVG();
				break;
			case 'curve':
				return this.renderCurveSVG();
				break;
			case 'curve-asymmetrical':
				return this.renderCurveAsymmetricalSVG();
				break;
			case 'curve-asymmetrical-negative':
				return this.renderCurveAsymmetricalNegativeSVG();
				break;
			case 'curve-negative':
				return this.renderCurveNegativeSVG();
				break;
		}
	}

	renderArrowSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 700 10" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`} d="M350,10L340,0h20L350,10z"/>
			</svg>
		);
	}

	renderArrowNegativeSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 700 10" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M360 0L350 9.9 340 0 0 0 0 10 700 10 700 0"/>
			</svg>
		);
	}

	renderBookSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M194,99c186.7,0.7,305-78.3,306-97.2c1,18.9,119.3,97.9,306,97.2c114.3-0.3,194,0.3,194,0.3s0-91.7,0-100c0,0,0,0,0-0 L0,0v99.3C0,99.3,79.7,98.7,194,99z"/>
			</svg>
		);
	}

	renderBookNegativeSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M806,94.7C619.5,90,500,20.3,500,1.7c-1,18.6-117.5,88.3-306,93C92,97.2,0,97.9,0,97.9v-0l0,0v2.3h1000v-2.3 C1000,97.7,920.3,97.6,806,94.7z M350,65.1L350,65.1L350,65.1L350,65.1z"/>
			</svg>
		);
	}

	renderCloudsSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M0 0v6.7c1.9-.8 4.7-1.4 8.5-1 9.5 1.1 11.1 6 11.1 6s2.1-.7 4.3-.2c2.1.5 2.8 2.6 2.8 2.6s.2-.5 1.4-.7c1.2-.2 1.7.2 1.7.2s0-2.1 1.9-2.8c1.9-.7 3.6.7 3.6.7s.7-2.9 3.1-4.1 4.7 0 4.7 0 1.2-.5 2.4 0 1.7 1.4 1.7 1.4h1.4c.7 0 1.2.7 1.2.7s.8-1.8 4-2.2c3.5-.4 5.3 2.4 6.2 4.4.4-.4 1-.7 1.8-.9 2.8-.7 4 .7 4 .7s1.7-5 11.1-6c9.5-1.1 12.3 3.9 12.3 3.9s1.2-4.8 5.7-5.7c4.5-.9 6.8 1.8 6.8 1.8s.6-.6 1.5-.9c.9-.2 1.9-.2 1.9-.2s5.2-6.4 12.6-3.3c7.3 3.1 4.7 9 4.7 9s1.9-.9 4 0 2.8 2.4 2.8 2.4 1.9-1.2 4.5-1.2 4.3 1.2 4.3 1.2.2-1 1.4-1.7 2.1-.7 2.1-.7-.5-3.1 2.1-5.5 5.7-1.4 5.7-1.4 1.5-2.3 4.2-1.1c2.7 1.2 1.7 5.2 1.7 5.2s.3-.1 1.3.5c.5.4.8.8.9 1.1.5-1.4 2.4-5.8 8.4-4 7.1 2.1 3.5 8.9 3.5 8.9s.8-.4 2 0 1.1 1.1 1.1 1.1 1.1-1.1 2.3-1.1 2.1.5 2.1.5 1.9-3.6 6.2-1.2 1.9 6.4 1.9 6.4 2.6-2.4 7.4 0c3.4 1.7 3.9 4.9 3.9 4.9s3.3-6.9 10.4-7.9 11.5 2.6 11.5 2.6.8 0 1.2.2c.4.2.9.9.9.9s4.4-3.1 8.3.2c1.9 1.7 1.5 5 1.5 5s.3-1.1 1.6-1.4c1.3-.3 2.3.2 2.3.2s-.1-1.2.5-1.9 1.9-.9 1.9-.9-4.7-9.3 4.4-13.4c5.6-2.5 9.2.9 9.2.9s5-6.2 15.9-6.2 16.1 8.1 16.1 8.1.7-.2 1.6-.4V0H0z"/>
			</svg>
		);
	}

	renderCloudsNegativeSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M265.8 3.5c-10.9 0-15.9 6.2-15.9 6.2s-3.6-3.5-9.2-.9c-9.1 4.1-4.4 13.4-4.4 13.4s-1.2.2-1.9.9c-.6.7-.5 1.9-.5 1.9s-1-.5-2.3-.2c-1.3.3-1.6 1.4-1.6 1.4s.4-3.4-1.5-5c-3.9-3.4-8.3-.2-8.3-.2s-.6-.7-.9-.9c-.4-.2-1.2-.2-1.2-.2s-4.4-3.6-11.5-2.6-10.4 7.9-10.4 7.9-.5-3.3-3.9-4.9c-4.8-2.4-7.4 0-7.4 0s2.4-4.1-1.9-6.4-6.2 1.2-6.2 1.2-.9-.5-2.1-.5-2.3 1.1-2.3 1.1.1-.7-1.1-1.1c-1.2-.4-2 0-2 0s3.6-6.8-3.5-8.9c-6-1.8-7.9 2.6-8.4 4-.1-.3-.4-.7-.9-1.1-1-.7-1.3-.5-1.3-.5s1-4-1.7-5.2c-2.7-1.2-4.2 1.1-4.2 1.1s-3.1-1-5.7 1.4-2.1 5.5-2.1 5.5-.9 0-2.1.7-1.4 1.7-1.4 1.7-1.7-1.2-4.3-1.2c-2.6 0-4.5 1.2-4.5 1.2s-.7-1.5-2.8-2.4c-2.1-.9-4 0-4 0s2.6-5.9-4.7-9c-7.3-3.1-12.6 3.3-12.6 3.3s-.9 0-1.9.2c-.9.2-1.5.9-1.5.9S99.4 3 94.9 3.9c-4.5.9-5.7 5.7-5.7 5.7s-2.8-5-12.3-3.9-11.1 6-11.1 6-1.2-1.4-4-.7c-.8.2-1.3.5-1.8.9-.9-2.1-2.7-4.9-6.2-4.4-3.2.4-4 2.2-4 2.2s-.5-.7-1.2-.7h-1.4s-.5-.9-1.7-1.4-2.4 0-2.4 0-2.4-1.2-4.7 0-3.1 4.1-3.1 4.1-1.7-1.4-3.6-.7c-1.9.7-1.9 2.8-1.9 2.8s-.5-.5-1.7-.2c-1.2.2-1.4.7-1.4.7s-.7-2.3-2.8-2.8c-2.1-.5-4.3.2-4.3.2s-1.7-5-11.1-6c-3.8-.4-6.6.2-8.5 1v21.2h283.5V11.1c-.9.2-1.6.4-1.6.4s-5.2-8-16.1-8z"/>
			</svg>
		);
	}

	renderCurveSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M1000,4.3V0H0v4.3C0.9,23.1,126.7,99.2,500,100S1000,22.7,1000,4.3z"/>
			</svg>
		);
	}

	renderCurveAsymmetricalSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M0,0c0,0,0,6,0,6.7c0,18,240.2,93.6,615.2,92.6C989.8,98.5,1000,25,1000,6.7c0-0.7,0-6.7,0-6.7H0z"/>
			</svg>
		);
	}

	renderCurveAsymmetricalNegativeSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M615.2,96.7C240.2,97.8,0,18.9,0,0v100h1000V0C1000,19.2,989.8,96,615.2,96.7z"/>
			</svg>
		);
	}

	renderCurveNegativeSVG() {
		return (
			<svg className={`${this.props.baseClass}__divider-svg`} xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 1000 100" preserveAspectRatio="none">
				<path className={`${this.props.baseClass}__divider-svg-fill`}
				      d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z"/>
			</svg>
		);
	}
}