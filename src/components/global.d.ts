declare const GetwidComponentsData: {
	settings: {
		iconsList: Record< string, string[] >;
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
