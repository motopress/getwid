import { createBlock } from '@wordpress/blocks';

import type { PersonAttributes } from './types';

type CoreImageAttributes = {
	id?: number;
	url?: string;
	caption?: string;
	imgId?: number;
	imgUrl?: string;
};

const transforms = {
	from: [
		{
			type: 'block' as const,
			blocks: [ 'core/image' ],
			transform: ( content: CoreImageAttributes ) =>
				createBlock( 'getwid/person', {
					imgId: content.imgId ?? content.id,
					imgUrl: content.imgUrl ?? content.url,
					content: content.caption,
				} ),
		},
	],
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/image' ],
			transform: ( attributes: PersonAttributes ) =>
				createBlock( 'core/image', {
					id: attributes.imgId,
					url: attributes.imgUrl,
					caption: attributes.content,
				} ),
		},
	],
};

export default transforms;
