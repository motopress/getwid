/**
* Module Constants
*/
const { jQuery: $ } = window;
import { __ , sprintf  } from 'wp.i18n';

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

export function getYouTubeID(url) {
    var expr = /(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/\S*(?:(?:\/e(?:mbed))?\/v?|(?:watch\?)?(?:\S*?&?vi?\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
    return (url.match(expr)) ? RegExp.$1 : false;
}

export function checkDisableBlock(blockName, Edit) {
	return {
		'edit' : (!Getwid.disabled_blocks.includes(blockName) ? Edit : ()=>{
			const message = sprintf( __( '%s block is disabled in plugin settings. <a href="%s">Manage Blocks</a>', 'getwid' ), blockName, Getwid.options_url.blocks );
			return(
				<p dangerouslySetInnerHTML={{__html: message}}></p>
			);
		})
	};
}

export function addScript(src, callback) {

    const script = document.createElement( 'script' );

    script.type = 'text/javascript';
    script.src = src;

    let done = false;
    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

    script.onload = script.onreadystatechange = function () {
        if ( !done && ( !this.readyState || this.readyState === 'loaded' || this.readyState === 'complete' ) ) {
            done = true;
            script.onload = script.onreadystatechange = null;
            callback( script );
        }
    };
}

export function isInViewport(element) {
    const itemTop = element.offset().top;
    const viewportTop  = $( window ).scrollTop();
    const windowHeight = $( window ).height();

    return (itemTop - viewportTop - windowHeight) < 0;
}

export function scrollHandler(selector, element, execute) {
    $( selector ).on( 'scroll', { element: element }, event => {
        if ( isInViewport( event.data.element ) ) {
            execute();
            $( this ).off( event );
        }
    });
}

export function getScrollableClassName() {

	/*
	 * 5.1
	 * edit-post-layout__content
	 *
	 * 5.3
	 * edit-post-layout__content
	 *
	 * 5.4
	 * block-editor-editor-skeleton__content
	 *
	 * 5.5
	 * interface-interface-skeleton__content
	 */

	let editor;

	// wp5.1 - wp5.3
	editor = $( '.edit-post-layout__content' );
	if ( editor.length ) {
		return editor[0].className;
	}

	// wp5.4
	editor = $( '.block-editor-editor-skeleton__content' );
	if ( editor.length ) {
		return editor[0].className;
	}

	// wp5.5
	editor = $( '.interface-interface-skeleton__content' );
	if ( editor.length ) {
		return editor[0].className;
	}

	return false;

	/*const $layoutContent = $( '.edit-post-layout__content' ).length ? $( '.edit-post-layout__content' ) : $( '.block-editor-editor-skeleton__content' );
    const $editorRegionsContent = $( '.edit-post-editor-regions__content' );
    return $layoutContent.length ? $layoutContent[ 0 ].className : $editorRegionsContent[ 0 ].className;
	*/

}

export function createResizeObserver($parent, baseClass, callback) {

    const iframe = document.createElement( 'iframe' );

    iframe.style.pointerEvents = 'none';
    iframe.style.position      = 'absolute';
    iframe.style.display       = 'block';

    iframe.style.height = '100%';
    iframe.style.width  = '100%';

    iframe.style.top    = '0';
    iframe.style.bottom = '0';
    iframe.style.left   = '0';

    iframe.style.backgroundColor = 'transparent';
    iframe.className = `${baseClass}__resize-observer`;

    $( iframe ).load( () => {
        $( iframe.contentWindow ).resize( () => {
            callback();
        } );
    } );

    $parent.append( iframe );
}

export function filtering(titles) {

    const stripHtmlTags = str => {
        if ( (str === null) || str === undefined || (str === '') ) {
           return false;
        } else {
            str = str.toString();
        }

       return str.replace( /<[^>]*>/g, '' );
   }

   return titles.map( (item, index) => {
       return stripHtmlTags( item.content );
   } );
}
