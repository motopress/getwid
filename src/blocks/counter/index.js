import attributes from './attributes';
import save from './save';

import visible from 'GetwidUtils/visible';
import Edit from './edit';

const {
    isInViewport,
    scrollHandler
} = visible;

const {
	registerBlockType,
} = wp.blocks;

export default registerBlockType(
    'getwid/counter',
    {
        title: __('Counter', 'getwid'),
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
        attributes: attributes,
        edit: (props) => {
            return (
                <Edit {...{
                    ...props,
                    isInViewport,
                    scrollHandler
                }}/>
            )
        },
        save: save
    }
);
