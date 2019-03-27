import "jquery-visible";

(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-progress-bar',
				getwid_progress_bar = $(this),
				getwid_fill_amount;

			getwid_fill_amount = !!getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') ? getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') : 0;

			function animate() {

				let $progress = getwid_progress_bar;
				let $content = $(`${className}__content`, $progress);
				let $percent = $(`${className}__percent`, $progress);

				const percent = () => { return Math.ceil(($content.width() / $content.parent().width()) * 100); }

				$content.animate({ width: `${getwid_fill_amount}%` }, {
					duration: 2000,
					progress: () => {
						$percent.text(percent() + '%');
					},
					complete: () => {
						$percent.text(`${getwid_fill_amount}%`);
					}
				});
			}

			function setScrollHandler($bar) {
				$(document).scroll({ bar: $bar }, (event) => {
					if (event.data.bar.visible()) {
						animate();
						$(document).off(event);
					}
				});
			}

			const $bar = $(getwid_progress_bar, `${className}__content`);

			$bar.visible() ? animate($bar) : setScrollHandler($bar);
		});
	});
})(jQuery);