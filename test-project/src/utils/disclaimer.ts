import { get, writable } from 'svelte/store';
import { getDisclaimerFromStorage } from './disclaimer-storage';

export const DISCLAIMER_STORAGE_KEY = 'disclaimers';
export const DISCLAIMER_QUERY = 'cms_ir_disc';

export const disclaimerStore = writable<DisclaimerState>(
    getDisclaimerFromStorage(DISCLAIMER_STORAGE_KEY) || {}
);

export type DisclaimerState = {
    [disclaimer: string]: {
        agreed: boolean | null;
        persistNoAccess: boolean | null;
        persistApproval: boolean | null;
    };
};

export interface DisclaimerAwareInteface {
    disclaimerToken?: string | null;
    disclaimer: string;
}

/**
 * check whether a disclaimer against a content is already agreed or not
 */
export const isDisclaimerAgreed = ({ disclaimer }: { disclaimer: string }) => {
    const disclaimerState = get(disclaimerStore);
    return disclaimerState?.[disclaimer]?.agreed === true;
};

/**
 * update the disclaimer to agreed against a disclaimer protected content
 * @param param0.disclaimer e.g ipo
 */
export const setDisclaimerToAgreed = ({
    disclaimer,
    persistApproval
}: {
    disclaimer: string;
    persistApproval?: boolean;
}) => {
    setDisclaimerStatus({
        disclaimer,
        persistApproval,
        agreed: true
    });
};
/**
 * update the disclaimer to agreed against a disclaimer protected content
 * @param param0.disclaimer e.g ipo
 */
export const setDisclaimerToDisagreed = ({
    disclaimer,
    persistNoAccess
}: {
    disclaimer: string;
    persistNoAccess: boolean;
}) => {
    setDisclaimerStatus({
        disclaimer,
        persistNoAccess,
        agreed: false
    });
};
/**
 * update the disclaimer value
 * @param param0.disclaimer e.g ipo
 * @param param0.contentId disclaimer protected content id. e.g. news uuid if its disclaimer protected
 */
export const setDisclaimerStatus = ({
    disclaimer,
    persistNoAccess,
    persistApproval,
    agreed
}: {
    disclaimer: string;
    persistNoAccess?: boolean;
    persistApproval?: boolean;
    agreed?: boolean;
}) => {
    disclaimerStore.update((state) => {
        state[disclaimer] = {
            ...(state[disclaimer] || {})
        };
        if (typeof persistNoAccess === 'boolean') {
            state[disclaimer].persistNoAccess = persistNoAccess;
        }
        if (typeof persistApproval === 'boolean') {
            state[disclaimer].persistApproval = persistApproval;
        }
        if (typeof agreed === 'boolean') {
            state[disclaimer].agreed = agreed;
        }
        return state;
    });
};

export const isDisclaimerPersistNoAccess = ({ disclaimer }: { disclaimer: string }): boolean => {
    const disclaimerState = get(disclaimerStore);
    return disclaimerState?.[disclaimer]?.persistNoAccess === true;
};

export const getAgreedDisclaimers = (): string[] => {
    const disclaimers = get(disclaimerStore);
    const agreedDisclaimers = [];
    for (const disc in disclaimers) {
        if (disclaimers[disc].agreed !== true) {
            continue;
        }
        agreedDisclaimers.push(disc);
    }
    return agreedDisclaimers;
};

export const tokenGenerater = (disclaimer: string, expiry: number = 5): string => {
    const bitLength = 6;
    const time = Math.floor(new Date().getTime() / 1000) + expiry;
    const timeToken = `${time}${disclaimer}`;
    const timeArray = timeToken.toString().split('');
    // generate number between 200K to 500K
    const rand = Math.floor(Math.random() * (500000 - 200000 + 1)) + 200000;
    const randArray = rand.toString().split('');
    const isEven = rand % 2 === 0;
    const stringArray = [];
    let randCount = randArray.length - 1;
    let position = 0;
    for (let i = 0; i < timeArray.length; i++) {
        const string = Array.from({ length: bitLength }, () =>
            ((Math.random() * 16) | 0).toString(16)
        );
        const randPosition = parseInt(randArray[randCount]);
        position = randPosition >= bitLength ? randPosition - bitLength : randPosition;
        string[position] = timeArray[i];
        stringArray.push(string.join(''));
        randCount--;
        if (randCount < 0) {
            randCount = randArray.length - 1;
        }
    }
    const result = isEven ? stringArray.reverse().join('') : stringArray.join('');
    return `${rand}${result}`;
};
