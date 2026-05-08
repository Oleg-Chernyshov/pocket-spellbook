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
  createCharacter as createCharacterRequest,
  updateCharacter as updateCharacterRequest,
  deleteCharacter as deleteCharacterRequest,
  getSpells as getSpellsRequest,
  learnSpell as learnSpellRequest,
  forgetSpell as forgetSpellRequest,
} from 'src/services/character.service';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    active: null as Character | null,
    spells: [] as SpellListItem[],
    isLoading: false as boolean,
  }),
  actions: {
    async loadActive(language?: LanguageCode): Promise<void> {
      this.isLoading = true;

      try {
        this.active = (await getCharactersRequest())[0] || null;

        if (this.active) 
          await this.loadSpells(this.active.id, language);
      } finally {
        this.isLoading = false;
      }
    },

    async create(dto: CreateCharacterDto, language?: LanguageCode): Promise<void> {
      this.active = await createCharacterRequest(dto);

      await this.loadSpells(this.active.id, language);
    },

    async update(id: number, dto: UpdateCharacterDto): Promise<void> {
      this.active = await updateCharacterRequest(id, dto);
    },

    async remove(id: number): Promise<void> {
      await deleteCharacterRequest(id);
      this.active = null;
      this.spells = [];
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
