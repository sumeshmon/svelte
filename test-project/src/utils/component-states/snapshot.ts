import { v4 as uuidv4 } from 'uuid';
export interface Snapshot {
    [key: string]: any;
}

const inMemoryStorage: Record<string, any> = {};
const inMemoryInitialStorage: Record<string, any> = {};

export const createSnapshot = <T extends Snapshot>(initialState?: T) => {
    let key = uuidv4();

    inMemoryInitialStorage[key] = initialState;

    /**
     * save the state
     * @param state
     */
    const saveSnapshot = (state: T) => {
        inMemoryStorage[key] = state;
    };

    /**
     * get current value of a field from
     * the current snapshot
     * @param fieldName
     * @returns
     */
    const getCurrentValue = (fieldName: string) => {
        return inMemoryStorage[key]?.[fieldName];
    };
    /**
     * get initial value of the field
     * from the initial state if given
     * while creating snapshot
     * @param fieldName
     * @returns
     */
    const getInitialValue = (fieldName: string) => {
        return inMemoryInitialStorage[key]?.[fieldName];
    };

    const getSnapshotKey = () => {
        return key;
    };

    const setSnapshotKey = (newSnapshotKey: string) => {
        if (newSnapshotKey === key) {
            return;
        }
        inMemoryInitialStorage[newSnapshotKey] = inMemoryInitialStorage[key];
        // inMemoryStorage[newKey] = inMemoryStorage[key];
        delete inMemoryInitialStorage[key];
        delete inMemoryStorage[key];
        key = newSnapshotKey;
    };

    return {
        saveSnapshot,
        getCurrentValue,
        getInitialValue,
        getSnapshotKey,
        setSnapshotKey
    };
};
