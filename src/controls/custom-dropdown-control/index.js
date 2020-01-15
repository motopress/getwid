/**
 * External dependencies
 */
import './editor.scss';
import classnames from "classnames";


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Popover,
} = wp.components;
const { Component, Fragment, createRef } = wp.element;

class GetwidCustomDropdownControl extends Component {
	constructor() {
		super( ...arguments );

		this.toggle = this.toggle.bind( this );
		this.close = this.close.bind( this );
		this.closeIfFocusOutside = this.closeIfFocusOutside.bind( this );

		this.containerRef = createRef();

		this.state = {
			isOpen: false,
		};
	}

	componentWillUnmount() {
		const { isOpen } = this.state;
		const { onToggle } = this.props;
		if ( isOpen && onToggle ) {
			onToggle( false );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isOpen } = this.state;
		const { onToggle } = this.props;
		if ( prevState.isOpen !== isOpen && onToggle ) {
			onToggle( isOpen );
		}
	}

	toggle() {
		this.setState( ( state ) => ( {
			isOpen: ! state.isOpen,
		} ) );
	}

	closeIfFocusOutside() {
		if (
			! this.containerRef.current.contains( document.activeElement ) &&
			! document.activeElement.closest( '[role="dialog"]' )
		) {
			this.close();
		}
	}

	close(param) {
		if ( this.props.onClose ) {
			this.props.onClose();
		}

		if (param === true){		
			this.setState( { isOpen: false } );
		}
	}

	render() {
		const { isOpen } = this.state;
		const {
			renderContent,
			renderToggle,
			position = 'bottom',
			className,
			contentClassName,
			expandOnMobile,
			headerTitle,
			focusOnMount,
			popoverProps,
		} = this.props;

		const args = { isOpen, onToggle: this.toggle, onClose: this.close };

		return (
			<div className={ classnames( 'components-dropdown', className ) } ref={ this.containerRef }>
				{ renderToggle( args ) }
				{ isOpen && (
					<Popover
						onClick={ (e) => {
							e.stopPropagation();							
						}}					
						className={ contentClassName }
						position={ position }
						onClose={ () => {
							this.close();
						} }
						onFocusOutside={ this.closeIfFocusOutside }
						expandOnMobile={ expandOnMobile }
						headerTitle={ headerTitle }
						focusOnMount={ focusOnMount }
						{ ...popoverProps }
					>
						{ renderContent( args ) }
					</Popover>
				) }
			</div>
		);
	}
}

export default GetwidCustomDropdownControl;