import { describe, it, expect } from 'vitest';

import { getMenuItems, type MenuItem } from '$utils/menu';
import { getDefaultLocale } from '$utils/default-locale';

const collectTitles = (menu: MenuItem[], collectedTitles: string[] = []): string[] => {
    for (const item of menu) {
        collectedTitles.push(item.title);
        if (item.submenu) {
            collectTitles(item.submenu, collectedTitles);
        }
    }
    return collectedTitles;
};

describe('Menu Items', () => {
    it('should not have duplicate titles', () => {
        const titles = collectTitles(getMenuItems(getDefaultLocale()));
        const titleCounts = titles.reduce((acc: Record<string, number>, title: string) => {
            acc[title] = (acc[title] || 0) + 1;
            return acc;
        }, {});

        const duplicateTitles = Object.entries(titleCounts)
            .filter(([, count]) => count > 1)
            .map(([title]) => title);

        expect(
            duplicateTitles,
            `Duplicate titles found: ${duplicateTitles.join(', ')}`
        ).toHaveLength(0);
    });
});
