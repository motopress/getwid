const $ = window.jQuery;

export default function animate(el, animationName, callback) {
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

	el.addClass('animated ' + animationName).one(animationEnd, function() {
		$(this).removeClass('animated ' + animationName);

		if (typeof callback === 'function') callback();
	});

	return this;
}