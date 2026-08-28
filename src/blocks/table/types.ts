import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type CellStyleObject = Record< string, string | number | undefined >;

export type TableCell = {
	content: string;
	styles?: string | CellStyleObject;
	colSpan?: string | number;
	rowSpan?: string | number;
};

export type TableRow = {
	cells: TableCell[];
};

export type TableSectionName = 'head' | 'body' | 'foot';

export type TableAttributes = {
	align?: string;
	head: TableRow[];
	body: TableRow[];
	foot: TableRow[];
	caption?: string;
	tableLayout?: string;
	borderCollapse?: string;
	horizontalAlign?: string;
	verticalAlign?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	className?: string;
};

export type TableSelectionCell = {
	rowIdx: number;
	columnIdx: number;
	rowSpan?: string | number;
	colSpan?: string | number;
	section: TableSectionName;
	minColIdx: number;
	maxColIdx: number;
	styles?: CellStyleObject;
	borderColor?: string;
};

export type RangeSelection = {
	fromCell: {
		fromRowIdx: number;
		fromRowSpan: number;
		fromMinColIdx: number;
		fromMaxColIdx: number;
		section: TableSectionName;
	};
	toCell?: {
		toRowIdx: number;
		toRowSpan: number;
		toMinColIdx: number;
		toMaxColIdx: number;
		section: TableSectionName;
	};
};

export type IndexRange = {
	minRowIdx: number;
	maxRowIdx: number;
	minColIdx: number;
	maxColIdx: number;
};

export type BorderTarget = 'top' | 'right' | 'bottom' | 'left' | 'all' | 'none';

export type TableEditProps = BlockEditProps< TableAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};
