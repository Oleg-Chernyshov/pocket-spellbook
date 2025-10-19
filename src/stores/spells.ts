import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { DEFAULT_LANGUAGE } from 'src/interfaces';
import type {
  PaginatedResponse,
  SpellListItem,
  SpellsQuery,
  LanguageCode,
  SpellLevel,
  SpellSchool,
  SourceBook,
  CharacterClass,
} from 'src/interfaces';

type FetchState = 'idle' | 'loading' | 'error';

export const useSpellsStore = defineStore('spells', {
  state: () => ({
    items: [] as SpellListItem[],
    page: 1 as number,
    limit: 20 as number,
    hasNext: true as boolean,
    total: 0 as number,
    language: DEFAULT_LANGUAGE as LanguageCode,
    search: '' as string,
    level: undefined as SpellLevel | undefined,
    school: undefined as SpellSchool | undefined,
    characterClass: undefined as number | undefined, // ID класса персонажа
    source: undefined as SourceBook | undefined,
    fetchState: 'idle' as FetchState,
    characterClasses: [] as CharacterClass[], // Все классы персонажей
  }),

  getters: {
    hasItems(state): boolean {
      return state.items.length > 0;
    },

    query(state): SpellsQuery {
      return {
        page: state.page,
        limit: state.limit,
        search: state.search || undefined,
        level: state.level,
        school: state.school,
        characterClass: state.characterClass,
        language: state.language,
        source: state.source,
      };
    },

    spellcasterClasses(state): CharacterClass[] {
      return state.characterClasses.filter((cls) => cls.hasSpells === 1);
    },
  },

  actions: {
    setLanguage(lang: LanguageCode): void {
      this.language = lang;
    },

    clearFilters(): void {
      this.search = '';
      this.level = undefined;
      this.school = undefined;
      this.characterClass = undefined;
      this.source = undefined;
    },

    setFilters(params: Partial<Omit<SpellsQuery, 'page' | 'limit'>>): void {
      if (params.search !== undefined) this.search = params.search;
      if (params.level !== undefined) this.level = params.level;
      if (params.school !== undefined) this.school = params.school;
      if (params.characterClass !== undefined)
        this.characterClass = params.characterClass;
      if (params.source !== undefined) this.source = params.source;
    },

    resetAndFetch: async function (): Promise<void> {
      this.items = [];
      this.page = 1;
      this.hasNext = true;
      await this.fetchNext();
    },

    async fetchNext(): Promise<void> {
      if (!this.hasNext || this.fetchState === 'loading') return;
      this.fetchState = 'loading';
      try {
        const { data } = await api.get<PaginatedResponse<SpellListItem>>(
          '/spells',
          {
            params: this.query,
          }
        );
        this.items.push(...data.data);
        this.page += 1;
        this.hasNext = data.pagination.hasNext;
        this.total = data.pagination.total;
      } catch (e) {
        this.fetchState = 'error';
        throw e;
      } finally {
        this.fetchState = 'idle';
      }
    },

    async fetchCharacterClasses(language?: LanguageCode): Promise<void> {
      const { data } = await api.get<CharacterClass[]>('/spells/classes', {
        params: { language: language || this.language },
      });
      this.characterClasses = data;
    },
  },
});
