import attributes from './attributes';
import save from './save';

import visible from 'GetwidUtils/visible';

import './style.scss';
import Edit from './edit';

const {
    isInViewport,
    scrollHandler
} = visible;

const {
	registerBlockType,
} = wp.blocks;

const { __ } = wp.i18n;

export default registerBlockType(
    'getwid/progress-bar',
    {
        title: __('Progress Bar', 'getwid'),
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
        save: () => { return null; }
        //save: save
    }
);