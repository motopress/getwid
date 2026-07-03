declare const GetwidComponentsData: {
	settings: {
		iconsList: Record< string, string[] >;
		image_sizes?: Array< {
			label: string;
			value: string;
		} >;
	};
	templates: {
		name: string;
		new: string;
		view: string;
		edit: string;
	};
	disabledBlocks: string[];
	optionsUrl: {
		general: string;
		appearance: string;
		blocks: string;
	};
};

declare module '*.css';
declare module '*.scss';
declare module 'GetwidVendor/fonticonpicker/react-fonticonpicker';
