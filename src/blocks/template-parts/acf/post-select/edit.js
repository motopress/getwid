/**
 * External dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { serverSideRender: ServerSideRender } = wp;

const {
	Component,
	Fragment,
} = wp.element;
const {
	Disabled,
} = wp.components;
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const {
	select,
} = wp.data;

/**
 * Create an Component
 */
class Edit extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			className,
			setAttributes,
		} = this.props;

		const current_post_type = select( "core/editor" ).getCurrentPostType();

		if ( current_post_type && current_post_type == Getwid.templates.name ) {
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<div className={className}>
						{ __('Select Field ACF', 'getwid') }
					</div>
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-select-acf"
							attributes={ this.props.attributes }
						/>
					</Disabled>
				</Fragment>
			);
		}
	}
}

export default ( Edit );
