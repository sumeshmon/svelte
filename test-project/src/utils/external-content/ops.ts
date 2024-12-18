import { fetchExternalContent } from '$utils/external-content/api';
import type { ExternalContent } from '$utils/external-content/types';

export const getExternalContent = async (
    slug: string,
    targetNode?: string | undefined
): Promise<ExternalContent | null> => {
    try {
        const response = await fetchExternalContent(slug);

        if (!response.ok) {
            console.error('Network response was not ok');
            return null;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('xml')) {
            return {
                content: await getXMLContent(response, targetNode),
                contentType: contentType
            };
        } else if (contentType.includes('json')) {
            return {
                content: await getJSONContent(response),
                contentType: contentType
            };
        } else if (contentType.includes('html')) {
            return {
                content: await getHTMLContent(response),
                contentType: contentType
            };
        } else {
            console.error('Unsupported content type:', contentType);
            return null;
        }
    } catch (error) {
        console.error('Error fetching external content:', error);
        return null;
    }
};

export const getHTMLContent = async (response: Response): Promise<any> => {
    try {
        return await response.text();
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return null;
    }
};

export const getJSONContent = async (response: Response): Promise<any> => {
    try {
        return await response.json();
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
};

export const getXMLContent = async (
    response: Response,
    targetNode: string = 'item'
): Promise<Element[] | null> => {
    try {
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Handle potential XML parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Error parsing XML: ' + parserError.textContent);
        }

        return Array.from(xmlDoc.querySelectorAll(targetNode));
    } catch (error) {
        console.error('Error parsing XML:', error);
        return null;
    }
};
