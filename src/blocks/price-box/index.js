import attributes from './attributes';
import edit from './edit';
import save from './save';

const {
	registerBlockType,
} = wp.blocks;

export default registerBlockType(
    'getwid/price-box',
    {
        title: __('Price Box', 'getwid'),
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" x="0px" y="0px"><path d="M12,2.24l6,3V22H6V5.24L12,2.24 M12,0L4,4v20h16V4L12,0L12,0z"/><g><path class="st1" d="M12,4c-0.55,0-1,0.45-1,1s0.45,1,1,1s1-0.45,1-1S12.55,4,12,4L12,4z"/></g><path d="M15,7h-2V6h-2v1h0C9.9,7,9,7.9,9,9v0.99C9,11.1,9.9,12,11.01,12L13,12.01L12.98,13H9v2h2v1h2v-1h-0.02	c1.11,0,2.02-0.91,2.02-2.02v-0.97C15,10.9,14.1,10,12.99,10L11,9.99L11,9h4V7z"/><rect x="8" y="18" width="8" height="2"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
		},
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes,
        edit,
        save
    }
);