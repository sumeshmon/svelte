/**
 * @param lang
 */
export const redirect = (lang, status) => {
    let url = lang ? `/${lang}/${status}/` : `/${status}/`;
    if (window.location.pathname !== url) {
        window.location.href = url;
    }
};
