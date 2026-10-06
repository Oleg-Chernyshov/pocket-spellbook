import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from 'src/stores/character';
import { STORAGE_KEYS } from 'src/utils/storage';

vi.mock('src/services/character.service', () => ({
  getCharacters: vi.fn(),
  getCharacter: vi.fn(),
  createCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  deleteCharacter: vi.fn(),
  getSpells: vi.fn(),
  learnSpell: vi.fn(),
  forgetSpell: vi.fn(),
}));

import * as characterService from 'src/services/character.service';

const characters = [
  { id: 1, name: 'Gandalf', characterClassId: 9, spellsCount: 2 },
  { id: 2, name: 'Elminster', characterClassId: 9, spellsCount: 1 },
];

describe('character store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(characterService.getSpells).mockResolvedValue([]);
  });

  it('loads the saved character as active', async () => {
    localStorage.setItem(STORAGE_KEYS.activeCharacterId, '2');
    vi.mocked(characterService.getCharacters).mockResolvedValue(characters);
    vi.mocked(characterService.getCharacter).mockResolvedValue(characters[1]);

    const store = useCharacterStore();
    await store.loadActive();

    expect(store.list).toHaveLength(2);
    expect(store.active?.id).toBe(2);
    expect(characterService.getCharacter).toHaveBeenCalledWith(2);
  });

  it('falls back to the first character when nothing is saved', async () => {
    vi.mocked(characterService.getCharacters).mockResolvedValue(characters);
    vi.mocked(characterService.getCharacter).mockResolvedValue(characters[0]);

    const store = useCharacterStore();
    await store.loadActive();

    expect(store.active?.id).toBe(1);
    expect(localStorage.getItem(STORAGE_KEYS.activeCharacterId)).toBe('1');
  });

  it('switches the active character and persists the id', async () => {
    vi.mocked(characterService.getCharacters).mockResolvedValue(characters);
    vi.mocked(characterService.getCharacter).mockResolvedValue(characters[1]);

    const store = useCharacterStore();
    store.list = [...characters];
    await store.select(2);

    expect(store.active?.name).toBe('Elminster');
    expect(localStorage.getItem(STORAGE_KEYS.activeCharacterId)).toBe('2');
  });

  it('selects another character after the active one is deleted', async () => {
    vi.mocked(characterService.deleteCharacter).mockResolvedValue(undefined);
    vi.mocked(characterService.getCharacter).mockResolvedValue(characters[1]);

    const store = useCharacterStore();
    store.list = [...characters];
    store.active = characters[0];

    await store.remove(1);

    expect(characterService.deleteCharacter).toHaveBeenCalledWith(1);
    expect(store.list).toEqual([characters[1]]);
    expect(store.active?.id).toBe(2);
  });
});
