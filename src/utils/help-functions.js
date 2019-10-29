/**
* Module Constants
*/
const {jQuery: $} = window;


/* #region perhaps use later */
// jQuery.fn.removeAllAttributes = function () {
//     return this.each(function () {
//         var attributes = $.map(this.attributes, function (item) {
//             return item.name;
//         });

//         var img = $(this);
//         $.each(attributes, function (i, item) {
//             if (item != 'class') {
//                 img.removeAttr(item);
//             }
//         });
//     });
// }
/* #endregion */

export function addScript(src, callback) {

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    var done = false;
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            callback(script);
        }
    };
}

export function isInViewport(element) {
    const itemTop = element.offset().top;
    const viewportTop  = $(window).scrollTop();
    const windowHeight = $(window).height();

    return (itemTop - viewportTop) - windowHeight < 0;
}

export function scrollHandler(selector, element, execute) {
    $(selector).on('scroll', { element: element }, (event) => {
        if (isInViewport(event.data.element)) {			
            execute();
            $(this).off(event);
        }
    });
}
