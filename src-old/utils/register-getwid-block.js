/**
* WordPress dependencies
*/
const {
    registerBlockType
} = wp.blocks;

export function registerBlock( name, settings, childBlocks = [] ) {
    registerBlockType(`getwid/${ name }`, settings);
    
    if (childBlocks.length) {
        childBlocks.forEach( childBlock => {
            registerBlockType( `getwid/${ childBlock.name }`, childBlock.settings );
        });
    }
}