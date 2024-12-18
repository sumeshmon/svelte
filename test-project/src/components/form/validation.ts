export const combineValidators = (
    ...validators: ((name: string, value: any) => Promise<void>)[]
) => {
    return async (name: string, value: any) => {
        await validators.reduce(async (_, validator) => {
            await _;
            await validator(name, value);
            return 0;
        }, Promise.resolve(0));
    };
};
export const combineValidates = (...validates: (() => Promise<void>)[]) => {
    return async () => {
        await Promise.all(
            validates.map(async (validate) => {
                await validate();
            })
        );
    };
};
export const required = (message: string = 'field is required') => {
    return (name: string, value: any) => {
        if (!value) {
            throw new Error(message);
        }
        if (Array.isArray(value) && value.length <= 0) {
            throw new Error(message);
        }
    };
};
export const email = (message: string = 'email is not valid') => {
    return (name: string, value: any) => {
        if (typeof value !== 'string') {
            throw new Error(message);
        }
        const reg = new RegExp(
            "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        );
        const matches = value.match(reg);
        if (!matches || matches?.length <= 0) {
            throw new Error(message);
        }
    };
};
