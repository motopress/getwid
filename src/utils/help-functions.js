const $ = window.jQuery;

jQuery.fn.removeAllAttributes = function() {
	return this.each(function() {
		var attributes = $.map(this.attributes, function(item) {
			return item.name;
		});

		var img = $(this);
		$.each(attributes, function(i, item) {
			img.removeAttr(item);
		});
	});
}

export function addScript(src, callback)
{
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =  src;
    var done = false;
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = script.onreadystatechange = function() {
        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") )
        {
            done = true;
            script.onload = script.onreadystatechange = null;
            callback();
        }
    };
}