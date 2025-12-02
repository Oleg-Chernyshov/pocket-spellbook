import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  SpellListItem,
  LanguageCode,
} from 'src/interfaces';

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
        const { data } = await api.get<Character[]>('/characters');
        this.active = data[0] || null;
        if (this.active) await this.loadSpells(this.active.id, language);
      } finally {
        this.isLoading = false;
      }
    },

    async create(dto: CreateCharacterDto, language?: LanguageCode): Promise<void> {
      const { data } = await api.post<Character>('/characters', dto);
      this.active = data;
      await this.loadSpells(data.id, language);
    },

    async update(id: number, dto: UpdateCharacterDto): Promise<void> {
      const { data } = await api.put<Character>(`/characters/${id}`, dto);
      this.active = data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/characters/${id}`);
      this.active = null;
      this.spells = [];
    },

    async loadSpells(id: number, language?: LanguageCode): Promise<void> {
      const { data } = await api.get<SpellListItem[]>(
        `/characters/${id}/spells`,
        {
          params: language ? { language } : undefined,
        }
      );
      this.spells = data;
    },

    async learnSpell(id: number, spellId: number, language?: LanguageCode): Promise<void> {
      await api.post(`/characters/${id}/spells/${spellId}`);
      await this.loadSpells(id, language);
    },

    async forgetSpell(id: number, spellId: number, language?: LanguageCode): Promise<void> {
      await api.delete(`/characters/${id}/spells/${spellId}`);
      await this.loadSpells(id, language);
    },
  },
});
