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
			//translators: %1$s is a block name, %2$s is a link
			const message = sprintf( __( '%1$s block is disabled in plugin settings. <a href="%2$s">Manage Blocks</a>', 'getwid' ), blockName, Getwid.options_url.blocks );
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
