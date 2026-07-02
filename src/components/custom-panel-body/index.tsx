import { Button, G, Path, SVG } from '@wordpress/components';
import { forwardRef, Fragment, useState } from '@wordpress/element';
import clsx from 'clsx';

import './editor.scss';

type Hint = {
	label: string;
	value: string;
};

type CustomPanelBodyProps = {
	title?: string;
	children?: JSX.Element | JSX.Element[] | string | null | false;
	opened?: boolean;
	initialOpen?: boolean;
	className?: string;
	onOpen?: () => void;
	onClose?: () => void;
	onToggle?: () => void;
	hints?: Hint[];
};

function ArrowIcon( { opened }: { opened: boolean } ) {
	return (
		<SVG
			className="components-panel__arrow"
			width="24px"
			height="24px"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<G>
				<Path fill="none" d="M0,0h24v24H0V0z" />
			</G>
			<G>
				<Path
					d={
						opened
							? 'M12,8l-6,6l1.41,1.41L12,10.83l4.59,4.58L18,14L12,8z'
							: 'M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z'
					}
				/>
			</G>
		</SVG>
	);
}

const CustomPanelBody = forwardRef< HTMLDivElement, CustomPanelBodyProps >(
	function CustomPanelBody(
		{
			title,
			children,
			opened,
			initialOpen = true,
			className,
			onOpen,
			onClose,
			onToggle,
			hints,
		},
		ref
	) {
		const [ internalOpened, setInternalOpened ] = useState( initialOpen );
		const isOpened = opened === undefined ? internalOpened : opened;
		const classes = clsx(
			'components-panel__body',
			'components-getwid-panel-body',
			className,
			{ 'is-opened': isOpened }
		);

		function toggle( event: { preventDefault: () => void } ) {
			event.preventDefault();

			if ( isOpened ) {
				onClose?.();
			} else {
				onOpen?.();
			}

			if ( opened === undefined ) {
				setInternalOpened( ( value ) => ! value );
			}

			onToggle?.();
		}

		return (
			<div className={ classes } ref={ ref }>
				{ !! title && (
					<h2 className="components-panel__body-title">
						<Button
							className="components-panel__body-toggle"
							onClick={ toggle }
							aria-expanded={ isOpened }
						>
							<span aria-hidden="true">
								<ArrowIcon opened={ isOpened } />
							</span>
							{ ! hints || isOpened ? (
								title
							) : (
								<Fragment>
									<span>{ title }</span>
									<div className="components-getwid-panel-body-row">
										{ hints.map( ( hint, index ) => (
											<div
												key={ index }
												className="components-getwid-panel-body-columns"
											>
												<span>
													{ hint.value !== '' &&
														hint.label }
												</span>
												{ hint.value !== '' &&
													hint.value }
											</div>
										) ) }
									</div>
								</Fragment>
							) }
						</Button>
					</h2>
				) }
				{ isOpened && children }
			</div>
		);
	}
);

export default CustomPanelBody;
