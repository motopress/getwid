import { __, sprintf } from 'wp.i18n';

const { Component } = wp.element;
const { Card, CardBody, Dropdown, Button, MenuGroup, MenuItemsChoice } = wp.components;

class GetwidContentSliderNavigation extends Component {

	render() {

		const {
			activateSlide,
			activeSlideIndex,
			activeSlideID,
			slidesCount,
			slidesOrder,
			selectBlock
		} = this.props;

		const slides = slidesOrder.map( (slide, index) => {
			return {
				value: slide,
				label: sprintf( __( 'Slide #%d', 'getwid' ), index + 1 )
			};
		} );

		return (
			<Card className="wp-block-getwid-content-slider__controls" size="xSmall">
				<CardBody className="wp-block-getwid-content-slider__controls-wrapper">
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
					<div className="wp-block-getwid-content-slider__controls-actions">
						<Button
							label={ __( 'Edit current slide', 'getwid' ) }
							variant="secondary"
							icon="edit"
							onClick={ () => {
								selectBlock( activeSlideID );
							} }
						/>
					</div>
					<div className="wp-block-getwid-content-slider__controls-slides">
						<Dropdown
							position="bottom left"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<div>
									<Button
										variant="secondary"
										onClick={ onToggle }
										aria-expanded={ isOpen }
										icon="arrow-down"
										iconPosition="right"
										text={ sprintf( __( 'Slide %d of %d', 'getwid' ), activeSlideIndex + 1, slidesCount ) }
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
