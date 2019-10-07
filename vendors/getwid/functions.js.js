const $ = window.jQuery;

function getwid_animate(el, animationSettings, callback) {
	var animationEnd = (function(el) {
		var animations = {
			animation: 'animationend',
			OAnimation: 'oAnimationEnd',
			MozAnimation: 'mozAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd',
		};

		for (var t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	})(document.createElement('div'));

	var animationName = typeof animationSettings.animation != 'undefined' ? animationSettings.animation : '';
	var animationDuration = typeof animationSettings.duration != 'undefined' ? animationSettings.duration : '1s';
	var animationDelay = typeof animationSettings.delay != 'undefined' ? animationSettings.delay : '0s';

	el.css({
        'animation-duration': animationDuration,
        'animation-delay': animationDelay,
        '-webkit-animation-delay': animationDelay
    });

	el.addClass('animated ' + animationName).one(animationEnd, function() {
		$(this).removeClass('animated ' + animationName);

		if (typeof callback === 'function') callback();
	});

	return this;
}