export default class Visible {

	static isInViewport(element) {
		let itemTop = element.offset().top;
		let viewportTop = $(window).scrollTop();
		let windowHeight = $(window).height();

		return (itemTop - viewportTop) - windowHeight < 0;
	}

	static scrollHandler(selector, element, execute) {
		$(selector).on('scroll', { element: element }, (event) => {
			if (Visible.isInViewport(event.data.element)) {			
				execute();
				$(this).off(event);
			}
		});
	}
}