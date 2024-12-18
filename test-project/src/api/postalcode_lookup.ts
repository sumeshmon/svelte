export interface PostalcodeLookupResponse {
    postalcodes?: Postalcode[];
}
export interface PostalcodeLookupErrorResponse {
    status: string;
    value: number;
}
export interface Postalcode {
    adminCode2: string;
    adminCode3: string;
    adminName3: string;
    adminCode1: string;
    adminName2: string;
    lng: number;
    countryCode: string;
    postalcode: string;
    adminName1: string;
    placeName: string;
    lat: number;
}

export const lookupPostalCode = async (params: {
    postalCode?: string;
    city?: string;
    country?: string;
}) => {
    try {
        const res = await fetch('/disclaimer/postal-code', {
            method: 'POST',
            body: JSON.stringify({
                placename: params.city,
                country: params.country,
                postalcode: params.postalCode
            })
        });

        const json = await res.json();

        if (res.status !== 200) {
            throw Error(json.status);
        }
        return (json as PostalcodeLookupResponse).postalcodes || [];
    } catch (err) {
        console.log(err);
        throw Error('Failed to fetch post codes data!');
    }
};
