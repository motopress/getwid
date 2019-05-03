import Inspector from './inspector';
import { __ } from 'wp.i18n';

const {
	Component,
	Fragment
} = wp.element;

const {
	Button,
	Disabled,
	ServerSideRender
} = wp.components;

const { compose } = wp.compose;
const { withColors } = wp.editor;

const inputClass = 'components-textarea-control__input';

class Edit extends Component {

	constructor() {
		super(...arguments);
		this.renderMailForm = this.renderMailForm.bind(this);
		this.onCheckFields  = this.onCheckFields .bind(this);
	}

	renderMailForm() {
		const { className, baseClass } = this.props;

		return (
			<form className={`${className}__email-form `} onSubmit={this.onCheckFields}>
				<div className={`${baseClass}__fields-wrapper`}>

					<div class={`${baseClass}__email-wrapper `}>
						<label class={`${baseClass}__label`}>{__('Email address', 'getwid')}</label>
						<input
							className={`${baseClass}__edit ${inputClass}`}
							type={'text'}
							placeholder={__('Email', 'getwid')}
							required
						/>
					</div>

					<div class={`${baseClass}__subject-wrapper`}>
						<label class={`${baseClass}__label`}>{__('Email subject line', 'getwid')}</label>
						<input
							className={`${baseClass}__edit ${inputClass}`}
							type={'text'}
							placeholder={__('Subject', 'getwid')}
							required
						/>
					</div>
				</div>
				<Button
					isPrimary
					type={'submit'}>
					{__('Add form', 'getwid')}
				</Button>
			</form>
		);
	}

	onCheckFields(event) {

		const {
			baseClass,
			setAttributes

		} = this.props;

		event.preventDefault();

		const email   = $(`.${baseClass}__email-wrapper`  ).find(`.${baseClass}__edit`).get(0).value;
		const subject = $(`.${baseClass}__subject-wrapper`).find(`.${baseClass}__edit`).get(0).value;

		if (/\S+@\S+\.\S+/.test(email) && subject) {
			setAttributes({ email, subject });
		}
	}

	render() {
		const {
			attributes: {
				email,
				subject
			}

		} = this.props;

		if (!email && !subject) {
			return this.renderMailForm();
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<Disabled>
					<ServerSideRender
						block='getwid/contact-form'
						attributes={this.props.attributes}
					/>
				</Disabled>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			/* */
		}
	}

	componentDidMount() {
		/* */
	}

	componentWillUnmount() {
		/* */
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);
