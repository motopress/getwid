/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

/**
 * Internal dependencies
 */
const {
	Button,
	Dashicon,
} = wp.components;

class FocusPanelBody extends Component {
	constructor( props ) {
		super( ...arguments );
		this.state = {
			opened: props.initialOpen === undefined ? true : props.initialOpen,
			onOpen: props.onOpen === undefined ? null : props.onOpen,
			onClose: props.onClose === undefined ? null : props.onClose,
		};
		this.toggle = this.toggle.bind( this );
	}

	toggle( event ) {
		event.preventDefault();

		if (!this.state.opened){
			this.state.onOpen();
		} else {
			this.state.onClose();
		}

		if ( this.props.opened === undefined ) {
			this.setState( ( state ) => ( {
				opened: ! state.opened,
			} ) );
		}

		if ( this.props.onToggle ) {
			this.props.onToggle();
		}
	}

	render() {
		const { title, children, opened } = this.props;
		const isOpened = opened === undefined ? this.state.opened : opened;
		const icon = `arrow-${ isOpened ? 'down' : 'right' }`;
		const className = classnames( 'components-panel__body', { 'is-opened': isOpened } );

		return (
			<div className={ className }>
				{ !! title && (
					<h3 className="components-panel__body-title">
						<Button
							className="components-panel__body-toggle"
							onClick={ this.toggle }
							aria-expanded={ isOpened }
						>
							<Dashicon icon={ icon } />
							{ title }
						</Button>
					</h3>
				) }
				{ isOpened && children }
			</div>
		);
	}
}

export default FocusPanelBody;