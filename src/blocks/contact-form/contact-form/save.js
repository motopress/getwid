/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	InnerBlocks
} = wp.editor;

const {
	Component,
	Fragment
} = wp.element;

/**
* Create an Component
*/
class Save extends Component {
	render() {
		const {
			attributes: {
				to,
				subject
			},

			className,
			baseClass

		} = this.props;		

		return (
			<Fragment>
				<div className={`${className}`}>
					<form className={`${baseClass}__form`} method={'post'}>
					
						<div className={`${baseClass}__fields-wrapper`}>
							<div className={`${baseClass}__editible`}>
								<InnerBlocks.Content/>
							</div>
							
							<input className={`${baseClass}__to`} type={'hidden'} value={to}/>
							<input className={`${baseClass}__subject`} type={'hidden'} value={subject}/>
						</div>

						<span
							className={`${baseClass}__response`}
						>
							{__('', 'getwid')}
						</span>
					</form>
				</div>				
			</Fragment>
		);
	}
}

export default (Save);