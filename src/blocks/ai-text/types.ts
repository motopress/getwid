export type AiTextAttributes = {
	prompt?: string;
};

export type AiTextEditProps = {
	attributes: AiTextAttributes;
	clientId: string;
	setAttributes: ( attributes: Partial< AiTextAttributes > ) => void;
};

export type CurrentUser = {
	meta?: {
		getwid_ai_accept_terms?: boolean;
	};
};
