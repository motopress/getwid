import attributes from './attributes';
import edit from './edit';
import save from './save';

const {
	registerBlockType,
} = wp.blocks;

const { __ } = wp.i18n;

export default registerBlockType(
    'getwid/price-box',
    {
        title: __('Price Box', 'getwid'),
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
