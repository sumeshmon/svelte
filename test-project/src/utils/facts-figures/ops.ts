import type {
    TableData,
    CellItems,
    CellValue,
    CellStyle,
    figuresData,
    figuresValues,
    DateFormat,
    Glossary
} from './types';
import { fetchFigures } from './api';
import { formatNumber, formatDate } from '$utils/ops';
import type { OptionType } from '@eqs/cms-svelte-irtools';
import { format, parse } from 'date-fns';

/**
 * get Facts & Figures
 * @param slug
 */
export const getFactsFigures = async (
    slug: string,
    dateFormat: DateFormat = {}
): Promise<TableData> => {
    const figures = (await fetchFigures(slug))['hydra:member'][0];
    const numberFormatCodes = ['0.00', '#,##0.0', '0.0000', '#,##0.00', '0', '#,##0'];
    const dateFormatCodes = ['m/d/yyyy', 'd/m/yyyy', 'yyyy/m/d'];
    let figuresData: TableData = [];
    if (!figures || !figures.content) {
        return figuresData as TableData;
    }
    figuresData = figures.content.map((item) => {
        const cell: CellValue[] = [];
        Object.values(item).forEach((cellData) => {
            const cellValue: CellValue = {
                formattedValue: cellData.cell.formattedValue,
                calculatedValue: cellData.cell.calculatedValue,
                numberFormatCode: cellData.cell.numberFormatCode,
                value: cellData.cell.value,
                column: cellData.cell.column,
                hyperLink: cellData.cell.hyperLink,
                hasRichText: cellData.cell.hasRichText,
                dataType: cellData.cell.dataType,
                attribute: cellData.attribute,
                html: cellData.cell.formattedValue
            };
            cellValue.formattedValue = cellValue.formattedValue.replace(
                /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                ''
            );

            if (cellData.cell.dataType == 'n' || cellData.cell.dataType == 'f') {
                const formatMatch = cellData.cell.numberFormatCode.match(
                    /([#0.,]+)\s*\\?\s*"?(.*?)"?$/
                );
                const numberFormat = formatMatch ? formatMatch[1] : null;
                const currencySymbol = formatMatch ? formatMatch[2] : null;
                let formattedValue: string = '';
                if (numberFormat && numberFormatCodes.includes(numberFormat)) {
                    formattedValue = formatNumber(parseFloat(cellData.cell.calculatedValue), {
                        minimumFractionDigits: countFractionDigits(numberFormat ?? '0')
                    });
                    if (currencySymbol && currencySymbol.length === 1) {
                        formattedValue += ' ' + currencySymbol;
                    }
                    cellValue.formattedValue = cellValue.html = formattedValue;
                }
            }
            if (
                cellData.cell.dataType == 'n' &&
                dateFormatCodes.includes(cellData.cell.numberFormatCode)
            ) {
                cellValue.html = getFiguresFormattedDate(
                    cellValue.formattedValue,
                    dateFormat,
                    cellData.cell.numberFormatCode
                );
            }

            if (cellData.cell.hasRichText && cellData.cell.cellItems !== null) {
                cellValue.html = createCellItemHtml(cellData.cell.cellItems);
            }
            cellValue.html = createCellHtml(cellValue.html, cellData.cell.style);

            cell.push(cellValue);
        });
        return cell as CellValue[];
    });
    return figuresData as TableData;
};

export const createCellItemHtml = (cellItems: CellItems | string) => {
    let cellItemHtml: string = '';
    const nullValues = [null, 'null', false, 'none', '', undefined];
    Object.values(cellItems).forEach((cellItem) => {
        if (nullValues.includes(cellItem.itemText)) {
            return;
        }
        let html: string = '';
        const classes: string[] = [];
        html = '<div';
        if (!nullValues.includes(cellItem.itemStyle.textUnderline)) {
            classes.push('text-underline');
        }
        if (!nullValues.includes(cellItem.itemStyle.fontStyle)) {
            classes.push('font-' + cellItem.itemStyle.fontStyle);
        }
        if (!nullValues.includes(cellItem.itemStyle.fontWeight)) {
            classes.push('font-weight-' + cellItem.itemStyle.fontWeight);
        }
        if (!nullValues.includes(cellItem.itemStyle.strikeThrough)) {
            classes.push('text-strike-through');
        }
        if (!nullValues.includes(cellItem.itemStyle.superscript)) {
            classes.push('text-superscript');
        }
        if (!nullValues.includes(cellItem.itemStyle.subscript)) {
            classes.push('text-subscript');
        }
        if (!nullValues.includes(cellItem.itemStyle.color)) {
            classes.push('color-' + cellItem.itemStyle.color);
        }

        if (classes.length > 0) {
            html += ' class="' + classes.join(' ') + '"';
        }
        html += '>' + cellItem.itemText + '</div>';
        cellItemHtml += html;
    });
    return cellItemHtml as string;
};

export const createCellHtml = (html: string, style: CellStyle) => {
    const classes: string[] = [];
    let cellHtml: string = html;
    const nullValues = [null, 'null', false, 'none', '', undefined];
    if (nullValues.includes(html)) {
        return cellHtml as string;
    }
    if (!nullValues.includes(style.textUnderline)) {
        classes.push('text-underline');
    }
    if (!nullValues.includes(style.fontStyle)) {
        classes.push('font-' + style.fontStyle);
    }
    if (!nullValues.includes(style.fontWeight)) {
        classes.push('font-weight-' + style.fontWeight);
    }
    if (!nullValues.includes(style.strikeThrough)) {
        classes.push('text-strike-through');
    }
    if (!nullValues.includes(style.color)) {
        classes.push('color-' + style.color);
    }
    if (!nullValues.includes(style.textAlign)) {
        classes.push('text-' + style.textAlign);
    }

    if (classes.length > 0) {
        cellHtml = '<div class="' + classes.join(' ') + '">' + cellHtml + '</div>';
    }
    return cellHtml as string;
};

export const countFractionDigits = (format: string) => {
    const parts = format.split('.');
    if (parts.length === 1) {
        return 0;
    }
    return parts[1].length;
};

/**
 * Get getKeyFiguresData
 * @param slug
 * @param noCounter
 * @param figureMinColumn
 * @param figureMaxColumn
 * @param symbolColumn
 * @param titleColumn
 * @param labelColumn
 * @param imageColumn
 */

export const getKeyFiguresData = async (
    slug: string,
    noCounter: boolean,
    figureMinColumn: number,
    figureMaxColumn: number,
    symbolColumn: number,
    titleColumn: number,
    labelColumn: number,
    imageColumn: number
): Promise<{ figuresData: figuresData; footNotes: string[] }> => {
    const figuresData: figuresData = [];
    let tableData: TableData = [];
    tableData = await getFactsFigures(slug);
    if (tableData.length == 0) {
        return { figuresData: figuresData, footNotes: [] };
    }
    figuresData.length = 0;
    const extractedData = extractAndRemoveFootnotes(tableData);
    tableData = extractedData.tableData;
    tableData.forEach((items) => {
        const figuresValues: figuresValues = [];
        if (items[figureMaxColumn]) {
            if (noCounter) {
                if (items[figureMaxColumn].html.trim() == '') {
                    return; // Skip if the row is empty
                }
                figuresValues[1] = items[figureMaxColumn].html;
            } else {
                if (isNaN(parseFloat(items[figureMaxColumn].calculatedValue))) {
                    if (!items[figureMaxColumn].calculatedValue) {
                        return;
                    }
                    const num = parseFloat(
                        items[figureMaxColumn].calculatedValue.replace(/[^\d.-]/g, '')
                    ); // Remove any non-number characters except '.' and '-' and convert to float
                    if (isNaN(num)) {
                        return; // Skip if the row is empty or not a number
                    }
                }
                figuresValues[1] = items[figureMaxColumn].calculatedValue;
            }
        }
        figuresValues[0] = '0';
        if (items[figureMinColumn]) {
            if (noCounter) {
                figuresValues[0] = items[figureMinColumn].html;
            } else {
                figuresValues[0] = items[figureMinColumn].calculatedValue;
            }
        }

        if (items[symbolColumn]) {
            figuresValues[2] = items[symbolColumn].html;
        }
        if (items[titleColumn]) {
            figuresValues[3] = items[titleColumn].html;
        }
        if (items[labelColumn]) {
            figuresValues[4] = items[labelColumn].html;
        }
        if (items[imageColumn]) {
            figuresValues[5] = items[imageColumn].calculatedValue;
        }
        figuresData.push(figuresValues);
    });

    return { figuresData: figuresData, footNotes: extractedData.footNotes };
};
export const getYearOptionsFromFigure = (
    tableData: TableData,
    index: number,
    order: 'asc' | 'desc' = 'desc'
): OptionType[] => {
    const uniqueOptions = new Set<string>();

    if (!Array.isArray(tableData) || tableData.length <= 1) {
        return [];
    }

    const options = tableData.slice(1).reduce((acc: OptionType[], row: CellValue[]) => {
        const item = row[index];

        if (
            item?.formattedValue &&
            item.formattedValue !== '' &&
            item?.numberFormatCode &&
            item.numberFormatCode !== ''
        ) {
            const year = getFullYear(item.formattedValue, item.numberFormatCode);

            if (year && !uniqueOptions.has(year)) {
                uniqueOptions.add(year);
                acc.push({
                    name: year,
                    value: year
                });
            }
        }

        return acc;
    }, []);

    options.sort((a, b) => {
        if (order === 'asc') {
            return a.value.localeCompare(b.value);
        } else {
            return b.value.localeCompare(a.value);
        }
    });

    return options;
};

export const getFullYear = (dateString: string, dateFormat: string | number): string | null => {
    try {
        const parsedDate = parse(dateString, (dateFormat as string).replace(';@', ''), new Date());
        return format(parsedDate, 'yyyy');
    } catch (e) {
        return null;
    }
};

export const getSummaryYear = (summaryString: string) => {
    const summaryYear = summaryString.replaceAll(/[a-zA-Z:\s]+/g, '');
    return summaryYear.length === 4 ? summaryYear : '';
};

export const extractAndRemoveFootnotes = (tableData: TableData) => {
    const footNotes: string[] = [];
    const data = tableData
        ?.map((row) => {
            const filteredRow = row.filter((item) => {
                if (item.attribute.isFootNote) {
                    footNotes.push(`<div class="footnote">${item.html}</div>`);
                    return false; // Exclude footnotes from the row
                }
                return true;
            });
            return filteredRow;
        })
        .filter((row) => row.length !== 0); // Filter out empty rows
    return { tableData: data, footNotes: footNotes };
};

export const getFiguresFormattedDate = (
    figureDate: string,
    dateFormat: DateFormat = {
        en: {
            month: '2-digit/',
            day: '2-digit/',
            year: 'numeric'
        },
        de: {
            day: '2-digit.',
            month: '2-digit.',
            year: 'numeric'
        }
    },
    inputDateFormat: string | null = null
) => {
    let date;
    if (inputDateFormat) {
        date = parse(figureDate, inputDateFormat.replace('m', 'M'), new Date());
        const options: Intl.DateTimeFormatOptions = {};
        return `${formatDate(date, options, dateFormat)}`;
    } else {
        return figureDate;
    }
};

export const extractGlossaryData = (tableData: TableData, defaultOpenIndex: number | null) => {
    const glossaryData: Glossary = {};
    let glossaryLetter: string = '';
    tableData?.map((row, index) => {
        if (!row[0].value) {
            glossaryData[glossaryLetter] = [
                ...glossaryData[glossaryLetter],
                ...[
                    {
                        title: row[1].formattedValue,
                        desc: row[2].html,
                        index,
                        isOpen: false
                    }
                ]
            ];
        } else {
            const openDefaultIndex = index == defaultOpenIndex ? true : false;
            glossaryLetter = row[0].value?.toUpperCase();
            glossaryData[glossaryLetter] = [
                {
                    title: row[1].formattedValue,
                    desc: row[2].html,
                    index,
                    isOpen: openDefaultIndex
                }
            ];
        }
    });
    return glossaryData;
};
