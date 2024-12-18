import { DISCLAIMER_QUERY, tokenGenerater, type DisclaimerAwareInteface } from '$utils/disclaimer';
import { openLinkInNewTab } from '$utils/ops';

export const handleClick = async (event: MouseEvent, item: DisclaimerAwareInteface) => {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    let link: string | null = target.href;
    if (target.tagName !== 'A' && target?.parentElement?.tagName === 'A') {
        const anchor = target.parentElement as HTMLAnchorElement;
        link = anchor.href;
    }

    if (!link) {
        return;
    }

    if (!item.disclaimer) {
        openLinkInNewTab(link);
        return;
    }

    const urlParams = new URLSearchParams();
    const url = new URL(link);
    url.searchParams.set(DISCLAIMER_QUERY, tokenGenerater(item.disclaimer));
    link = url.toString();

    openLinkInNewTab(link);
};
