const filteredBlocks = [
	'getwid/template-post-title',
	'getwid/template-post-featured-image',
	'getwid/template-post-content',
];
  
wp.blocks.getBlockTypes().forEach( function( blockType ) {
	if (filteredBlocks.includes(blockType.name)){
		wp.blocks.unregisterBlockType( blockType.name );
	}
});