import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  CharacterSpell,
} from 'src/interfaces';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    active: null as Character | null,
    spells: [] as CharacterSpell[],
    isLoading: false as boolean,
  }),
  actions: {
    async loadActive(): Promise<void> {
      this.isLoading = true;

      try {
        const { data } = await api.get<Character[]>('/characters');
        this.active = data[0] || null;
        if (this.active) await this.loadSpells(this.active.id);
      } finally {
        this.isLoading = false;
      }
    },

    async create(dto: CreateCharacterDto): Promise<void> {
      const { data } = await api.post<Character>('/characters', dto);
      this.active = data;
      await this.loadSpells(data.id);
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

    async loadSpells(id: number): Promise<void> {
      const { data } = await api.get<CharacterSpell[]>(
        `/characters/${id}/spells`
      );
      this.spells = data;
    },

    async learnSpell(id: number, spellId: number): Promise<void> {
      await api.post(`/characters/${id}/spells/${spellId}`);
      await this.loadSpells(id);
    },

    async forgetSpell(id: number, spellId: number): Promise<void> {
      await api.delete(`/characters/${id}/spells/${spellId}`);
      await this.loadSpells(id);
    },
  },
});
