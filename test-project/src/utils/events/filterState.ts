import { writable } from 'svelte/store';
import { PUBLIC_PAGE_LIMIT } from '$env/static/public';

export const itemsPerPage = writable<string>(PUBLIC_PAGE_LIMIT.toString());
export const currentPage = writable<number>(1);
export const category = writable<string>('');
export const year = writable<string>('');
