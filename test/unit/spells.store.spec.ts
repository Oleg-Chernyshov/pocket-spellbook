import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSpellsStore } from 'src/stores/spells';

vi.mock('src/services/spell.service', () => ({
  getSpells: vi.fn(),
  getCharacterClasses: vi.fn(),
}));

vi.mock('src/services/ai.service', () => ({
  smartSearchSpells: vi.fn(),
}));

import * as spellService from 'src/services/spell.service';
import * as aiService from 'src/services/ai.service';

const page = {
  data: [{ id: 1, name: 'Fireball', level: '3', school: 'Evocation' }],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

describe('spells store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads the next page of spells', async () => {
    vi.mocked(spellService.getSpells).mockResolvedValue(page as never);

    const store = useSpellsStore();
    await store.fetchNext();

    expect(store.items).toHaveLength(1);
    expect(store.hasNext).toBe(false);
    expect(store.total).toBe(1);
  });

  it('uses smart search when the toggle is on and the query is not empty', async () => {
    vi.mocked(aiService.smartSearchSpells).mockResolvedValue(page as never);

    const store = useSpellsStore();
    store.setFilters({ search: 'fire', smartSearch: true });
    await store.resetAndFetch();

    expect(aiService.smartSearchSpells).toHaveBeenCalled();
    expect(spellService.getSpells).not.toHaveBeenCalled();
  });

  it('filters spellcaster classes', async () => {
    vi.mocked(spellService.getCharacterClasses).mockResolvedValue([
      { id: 9, title: 'Wizard', titleEn: 'Wizard', titleRu: 'Волшебник', hasSpells: 1 },
      { id: 10, title: 'Fighter', titleEn: 'Fighter', titleRu: 'Воин', hasSpells: 0 },
    ]);

    const store = useSpellsStore();
    await store.fetchCharacterClasses();

    expect(store.spellcasterClasses).toHaveLength(1);
    expect(store.spellcasterClasses[0].id).toBe(9);
  });
});
