export type CellItemStyle = {
    color: string;
    fontSize: number;
    fontStyle: string;
    subscript: boolean;
    fontFamily: string;
    fontWeight: string;
    superscript: boolean;
    strikeThrough: boolean;
    textUnderline: string;
};

export type CellItem = {
    itemText: string;
    itemStyle: CellItemStyle;
};

export type CellItems = CellItem[];

export type CellStyle = {
    color: string;
    fontSize: string;
    fontStyle: null | string;
    textAlign: string;
    fontFamily: string;
    fontWeight: null | string;
    strikeThrough: boolean;
    textUnderline: string;
};

export type Cell = {
    style: CellStyle;
    value: string;
    column: string;
    dataType: string;
    cellItems: null | CellItems;
    hasRichText: boolean;
    hyperLink: string | null;
    formattedValue: string;
    calculatedValue: string;
    numberFormatCode: string;
};

export type CellAttribute = {
    width: number | null;
    colspan: number;
    visible: boolean;
    isFootNote: boolean;
    backgroundColor: string;
};

export type CellData = {
    cell: Cell;
    attribute: CellAttribute;
};

export type Content = {
    content: CellData;
};

export type Figures = {
    name: string;
    slug: string;
    content: Content[];
};

export type CellValue = {
    formattedValue: string;
    calculatedValue: string;
    numberFormatCode: string | number;
    html: string;
    hyperLink: string | null;
    hasRichText: boolean;
    value: string | null;
    column: string | null;
    dataType: string | null;
    attribute: CellAttribute;
};
export type TableData = CellValue[][];

export type figuresValues = string[];
export type figuresData = figuresValues[];
export type DateFormat = {
    [key: string]: { [key: string]: string };
};

export type Glossary = {
    [key: string]: GlossaryValues[];
};

export type GlossaryValues = {
    title: string;
    desc: string;
    index: number;
    isOpen: boolean;
};
