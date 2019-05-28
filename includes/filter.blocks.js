const filteredBlocks = [
	'getwid/template-post-title',
	'getwid/template-post-featured-image',
	'getwid/template-post-content',
	'getwid/template-post-link',

	'getwid/template-post-author',
	'getwid/template-post-categories',
	'getwid/template-post-comments',
	'getwid/template-post-tags',
	'getwid/template-post-date',
	'getwid/template-post-featured-background-image',
];
  
wp.blocks.getBlockTypes().forEach( function( blockType ) {
	if (filteredBlocks.includes(blockType.name)){
		wp.blocks.unregisterBlockType( blockType.name );
	}
});