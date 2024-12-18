export const cancelRequestsMap = new Map();

export function canCancelRequest(): boolean {
    return typeof AbortController === 'function';
}

export function initCancelRequest(
    requestId: string,
    requestOptions: {
        [key: string]: unknown;
    }
): {
    [key: string]: unknown;
} {
    const prevController = cancelRequestsMap.get(requestId);
    if (prevController) {
        prevController.abort();
    }

    const controller = new AbortController();
    cancelRequestsMap.set(requestId, controller);

    const signal = controller.signal;

    return { ...requestOptions, ...{ signal } };
}

export function clearCancelRequestMap(requestId: string): void {
    cancelRequestsMap.delete(requestId);
}
