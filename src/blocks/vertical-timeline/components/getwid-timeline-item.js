/**
 * Internal dependencies
 */

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import classnames from 'classnames';

const { compose } = wp.compose;
const { withColors } = wp.editor;
const { Component, Fragment } = wp.element;

/**
* Create an Component
*/
class GetwidTimelineItem extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const { className, baseClass } = this.props;

		return (
			<Fragment>
				<div className={`${baseClass}`}>
					<div className={`${baseClass}__inner`}>
						<div className={`${baseClass}__node`}>
							<div className={`${baseClass}__node-inner`}></div>
						</div>
						<div className={`${baseClass}__wrapper`}>
							<div className={`${baseClass}__item-content`}>
								<div className={`${baseClass}__content-inner`}>
									<div className={`${baseClass}__image-wrapper`}>
										<img src="http://wordpress/wp-content/uploads/2019/07/cropped-1920-1080-382219-1024x576.jpg"/>
									</div>
									<div className={`${baseClass}__content-wrapper`}>
										<h5>Aliquam erat volutpat</h5>
										<p>Duis hendrerit venenatis felis in commodo. Sed lobortis ante gravida, suscipit ligula vel, faucibus turpis. Morbi varius consequat ligula, sed pretium eros placerat at. Fusce consectetur egestas mauris quis porta.</p>
									</div>
								</div>
							</div>
							<div className={`${baseClass}__item-date`}>
								<div className={`${baseClass}__date-label`}>
									<span>29 June 2017</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		/* */
	}

	componentDidMount() {		
		/* */
	}
}

export default compose( [
	withColors( { textColor: 'color' } )
] )( GetwidTimelineItem );