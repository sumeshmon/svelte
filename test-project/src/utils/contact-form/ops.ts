export const prepareKeyValuePairs = <T extends { [key: string]: unknown }>(
    data: Record<string, unknown>,
    fieldsMap: { [from: string]: string },
    keyFieldName = 'name',
    valueFieldName = 'value'
): T[] => {
    const meta: T[] = [];
    Object.entries(data).map(([name, value]) => {
        if (!fieldsMap[name] || !value) {
            return;
        }
        let formattedValue = value;
        if (Array.isArray(formattedValue)) {
            formattedValue = formattedValue.join(', ');
        }
        meta.push({
            [keyFieldName]: fieldsMap[name],
            [valueFieldName]: formattedValue
        } as T);
    });
    return meta;
};

export const removeEmptyFields = <T extends Record<string, unknown>>(data: T): T => {
    return Object.entries(data).reduce((result, [key, value]) => {
        if (value) {
            result[key] = value;
        }
        return result;
    }, {} as Record<string, unknown>) as T;
};

export const filterOutFields = <T extends Record<string, unknown>>(
    data: T,
    allowedFields: string[]
): T => {
    return Object.fromEntries(allowedFields.map((k) => [k, data[k]])) as T;
};
