import type { BlockEditProps } from '@wordpress/blocks';

export type InstagramAttributes = {
	photoCount: number;
	gridColumns: number;
	spacing: string;
	align?: string;
	className?: string;
};

export type InstagramEditProps = BlockEditProps< InstagramAttributes > & {
	className?: string;
};

export type ServerSideRenderProps = {
	block: string;
	attributes: InstagramAttributes;
};

export type RuntimeGlobal = Window & {
	Getwid: {
		ajax_url: string;
		get_instagram_token_url: string;
		nonces: {
			check_instagram_token: string;
		};
		settings: {
			instagram_token_isset: boolean;
		};
	};
	wp?: {
		serverSideRender?: ( props: ServerSideRenderProps ) => JSX.Element;
	};
};
