import { fetchCompanyContactData } from '$utils/company-contact/api';
import type { CompanyContactData } from '$utils/company-contact/types';

export const getCompanyContactData = async (): Promise<CompanyContactData | null> => {
    try {
        const response = await fetchCompanyContactData();
        return await response;
    } catch (error) {
        console.error('Error fetching company contact data:', error);
        return null;
    }
};
