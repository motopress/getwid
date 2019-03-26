import attributes from './attributes';
import edit from './edit';
import save from './save';

const {
	registerBlockType,
} = wp.blocks;

const { __ } = wp.i18n;

export default registerBlockType(
    'getwid/test-icon',
    {
        title: __('Test_icon'),
		category: 'getwid-blocks',
        icon: "editor-paste-word",
        attributes,
        save,
        edit,
    }
)