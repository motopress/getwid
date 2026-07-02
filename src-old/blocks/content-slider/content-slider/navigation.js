/**
 * External dependencies
 */
import { __, sprintf } from 'wp.i18n';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { Card, CardBody, Dropdown, Button, MenuGroup, MenuItemsChoice } = wp.components;

class GetwidContentSliderNavigation extends Component {

	render() {

		const {
			addSlide,
			activateSlide,
			activeSlideIndex,
			activeSlideID,
			slidesCount,
			slidesOrder,
			selectBlock,
			isEditActive
		} = this.props;

		const slides = slidesOrder.map( (slide, index) => {
			return {
				value: slide,
				//translators: %d is a counter 1, 2, 3
				label: sprintf( __( 'Slide %d', 'getwid' ), index + 1 )
			};
		} );

		if ( slidesCount <= 0 ) {
			return (
				<Card className="wp-block-getwid-content-slider__controls" size="xSmall">
					<CardBody className="wp-block-getwid-content-slider__controls-wrapper">
						<div className="wp-block-getwid-content-slider__controls-actions">
							<Button
								label={ __( 'Add Slide', 'getwid' ) }
								variant="secondary"
								disabled={ !isEditActive }
								onClick={ () => {
									addSlide();
								} }
							>
								{__( 'Add Slide', 'getwid' )}
							</Button>
						</div>
					</CardBody>
				</Card>
			);
		}

		return (
			<Card className="wp-block-getwid-content-slider__controls" size="xSmall">
				<CardBody className="wp-block-getwid-content-slider__controls-wrapper">
					<div className="wp-block-getwid-content-slider__controls-actions">
						<Button
							label={ __( 'Edit Slide', 'getwid' ) }
							variant="secondary"
							icon="edit"
							disabled={ !isEditActive }
							onClick={ () => {
								selectBlock( activeSlideID );
							} }
						>
							{__( 'Edit Slide', 'getwid' )}
						</Button>
					</div>
					<div className="wp-block-getwid-content-slider__controls-arrows">
						<Button
							label={ __( 'Previous', 'getwid' ) }
							variant="secondary"
							icon="arrow-left-alt2"
							disabled={ activeSlideIndex === 0 }
							onClick={ () => {
								activateSlide( activeSlideIndex - 1 );
							} }
						/>
						<Button
							label={ __( 'Next', 'getwid' ) }
							variant="secondary"
							icon="arrow-right-alt2"
							disabled={ activeSlideIndex === slidesCount - 1 }
							onClick={ () => {
								activateSlide( activeSlideIndex + 1 );
							} }
						/>
					</div>
					<div className="wp-block-getwid-content-slider__controls-slides">
						<Dropdown
							popoverProps={ { placement: "bottom-end" } }
							renderToggle={ ( { isOpen, onToggle } ) => (
								<div>
									<Button
										variant="secondary"
										onClick={ onToggle }
										aria-expanded={ isOpen }
										icon="arrow-down"
										iconPosition="right"
										//translators: %1$d is slide number, %2$d is total slides count
										text={ sprintf( __( 'Slide %1$d of %2$d', 'getwid' ), activeSlideIndex + 1, slidesCount ) }
									/>
								</div>
							) }
							renderContent={ () => <div style={ { minWidth: '200px', maxHeight: '200px' } }>
								<MenuGroup>
									<MenuItemsChoice
										choices={ slides }
										value={ activeSlideID }
										onSelect={ ( slideId ) => {
											activateSlide( slidesOrder.indexOf( slideId ) );
										} }
									/>
								</MenuGroup>
							</div> }
						/>
					</div>
				</CardBody>
			</Card>
		)
	}
}

export default GetwidContentSliderNavigation;
