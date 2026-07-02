import type { BlockEditProps } from '@wordpress/blocks';

export type MailchimpAttributes = {
	align?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	text: string;
	ids: string[];
	className?: string;
};

export type MailchimpListInterest = {
	id: string;
	title: string;
};

export type MailchimpListCategory = {
	id: string;
	title: string;
	interests?: MailchimpListInterest[];
};

export type MailchimpList = {
	id: string;
	title: string;
	categories?: MailchimpListCategory[];
};

export type MailchimpState = {
	apiKey: string;
	waitLoadList: boolean;
	error: string;
	list: MailchimpList[];
};

export type MailchimpColorState = {
	color?: string;
	class?: string;
};

export type MailchimpEditProps = BlockEditProps< MailchimpAttributes > & {
	backgroundColor: MailchimpColorState;
	textColor: MailchimpColorState;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};

export type MailchimpInspectorProps = MailchimpEditProps & {
	manageMailchimpApiKey: (
		event: { preventDefault?: () => void } | null,
		option: MailchimpApiKeyAction
	) => void;
	setGroupsName: () => Array< { value: string; label: string } >;
	getData: < K extends keyof MailchimpState >(
		key: K
	) => MailchimpState[ K ];
};

export type MailchimpApiKeyAction = 'save' | 'sync' | 'load' | 'delete';

export type MailchimpRuntime = Window & {
	Getwid?: {
		ajax_url: string;
		current_user?: {
			can_manage_options?: boolean;
		};
		settings?: {
			mailchimp_api_key?: string;
		};
		nonces?: {
			mailchimp_api_key?: string;
		};
	};
};
