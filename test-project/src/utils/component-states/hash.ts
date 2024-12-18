import crypto from 'crypto-js';

export function generateMD5Hash(url: string, variables: Record<string, any>): string {
    const dataToHash = url + JSON.stringify(variables);
    return crypto.MD5(dataToHash).toString();
}
