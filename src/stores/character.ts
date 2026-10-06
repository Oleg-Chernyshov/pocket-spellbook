import { defineStore } from 'pinia';

import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  SpellListItem,
  LanguageCode,
} from 'src/interfaces';

import {
  getCharacters as getCharactersRequest,
  getCharacter as getCharacterRequest,
  createCharacter as createCharacterRequest,
  updateCharacter as updateCharacterRequest,
  deleteCharacter as deleteCharacterRequest,
  getSpells as getSpellsRequest,
  learnSpell as learnSpellRequest,
  forgetSpell as forgetSpellRequest,
} from 'src/services/character.service';
import { safeGetItem, safeRemoveItem, safeSetItem, STORAGE_KEYS } from 'src/utils/storage';

function readActiveId(): number | null {
  const raw = safeGetItem(STORAGE_KEYS.activeCharacterId);
  if (!raw) return null;

  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function persistActiveId(id: number | null): void {
  if (id === null) {
    safeRemoveItem(STORAGE_KEYS.activeCharacterId);
    return;
  }

  safeSetItem(STORAGE_KEYS.activeCharacterId, String(id));
}

export const useCharacterStore = defineStore('character', {
  state: () => ({
    list: [] as Character[],
    active: null as Character | null,
    spells: [] as SpellListItem[],
    isLoading: false as boolean,
  }),
  getters: {
    hasCharacters(state): boolean {
      return state.list.length > 0;
    },
  },
  actions: {
    async loadList(): Promise<void> {
      this.list = await getCharactersRequest();
    },

    async loadActive(language?: LanguageCode): Promise<void> {
      this.isLoading = true;

      try {
        await this.loadList();

        const savedId = readActiveId();
        const selected =
          this.list.find((character) => character.id === savedId) ||
          this.list[0] ||
          null;

        if (selected) {
          await this.select(selected.id, language);
        } else {
          this.active = null;
          this.spells = [];
          persistActiveId(null);
        }
      } finally {
        this.isLoading = false;
      }
    },

    async select(id: number, language?: LanguageCode): Promise<void> {
      this.isLoading = true;

      try {
        this.active = await getCharacterRequest(id);
        persistActiveId(this.active.id);
        await this.loadSpells(this.active.id, language);

        const index = this.list.findIndex((character) => character.id === id);
        if (index >= 0) {
          this.list[index] = {
            ...this.list[index],
            ...this.active,
            spellsCount: this.list[index].spellsCount ?? this.spells.length,
          };
        }
      } finally {
        this.isLoading = false;
      }
    },

    async create(dto: CreateCharacterDto, language?: LanguageCode): Promise<void> {
      this.active = await createCharacterRequest(dto);
      persistActiveId(this.active.id);
      await this.loadList();
      await this.loadSpells(this.active.id, language);
    },

    async update(id: number, dto: UpdateCharacterDto): Promise<void> {
      this.active = await updateCharacterRequest(id, dto);
      persistActiveId(this.active.id);
      await this.loadList();
    },

    async remove(id: number, language?: LanguageCode): Promise<void> {
      await deleteCharacterRequest(id);
      this.list = this.list.filter((character) => character.id !== id);

      if (this.active?.id === id) {
        const next = this.list[0] || null;
        if (next) {
          await this.select(next.id, language);
        } else {
          this.active = null;
          this.spells = [];
          persistActiveId(null);
        }
      }
    },

    async loadSpells(id: number, language?: LanguageCode): Promise<void> {
      this.spells = await getSpellsRequest(id, language);
    },

    async learnSpell(id: number, spellId: number, language?: LanguageCode): Promise<void> {
      await learnSpellRequest(id, spellId);
      await this.loadSpells(id, language);
    },

    async forgetSpell(id: number, spellId: number, language?: LanguageCode): Promise<void> {
      await forgetSpellRequest(id, spellId);
      await this.loadSpells(id, language);
    },
  },
});
