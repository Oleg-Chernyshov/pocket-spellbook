export type LanguageCode = 'en' | 'ru';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type SpellLevel =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type SpellSchool =
  | 'Abjuration'
  | 'Conjuration'
  | 'Divination'
  | 'Enchantment'
  | 'Evocation'
  | 'Illusion'
  | 'Necromancy'
  | 'Transmutation';

export type SourceBook = 'PHB' | 'XGE' | 'TCE' | 'FTD' | 'EGW';

export interface SpellListItem {
  id: number;
  name: string;
  level: SpellLevel | string; // API returns strings for level
  school: SpellSchool;
  text: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  source: SourceBook;
}

export type SpellDetails = SpellListItem;

export interface SpellsQuery {
  page?: number;
  limit?: number;
  search?: string;
  level?: SpellLevel;
  school?: SpellSchool;
  characterClass?: CharacterClassCode;
  language?: LanguageCode;
  source?: SourceBook;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface CreateCharacterDto {
  name: string;
  characterClassId: number;
  spellSlots?: Record<string, number>;
}

export interface UpdateCharacterDto {
  name?: string;
  characterClassId?: number;
  spellSlots?: Record<string, number>;
}

export interface Character {
  id: number;
  name: string;
  characterClassId: number;
  spellSlots?: Record<string, number>;
}

export interface CharacterSpell {
  id: number;
  nameEn: string;
  nameRu: string;
  level: string;
  textEn: string;
  textRu: string;
  schoolEn: string;
  schoolRu: string;
  castingTimeEn: string;
  castingTimeRu: string;
  rangeEn: string;
  rangeRu: string;
  materialsEn?: string;
  materialsRu?: string;
  componentsEn: string;
  componentsRu: string;
  durationEn: string;
  durationRu: string;
  sourceEn: string;
  sourceRu: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSpellsStatsResponse {
  total: number;
  byLevel: Record<string, number>;
  bySchool: Record<SpellSchool, number>;
}

export interface CharacterClassOption {
  id: number;
  code: CharacterClassCode;
  nameRu: string;
}

export type CharacterClassCode =
  | 'Artificer'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Paladin'
  | 'Ranger'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';

export const CHARACTER_CLASSES: CharacterClassOption[] = [
  { id: 1, code: 'Artificer', nameRu: 'Изобретатель' },
  { id: 2, code: 'Bard', nameRu: 'Бард' },
  { id: 3, code: 'Cleric', nameRu: 'Жрец' },
  { id: 4, code: 'Druid', nameRu: 'Друид' },
  { id: 5, code: 'Paladin', nameRu: 'Паладин' },
  { id: 6, code: 'Ranger', nameRu: 'Рейнджер' },
  { id: 7, code: 'Sorcerer', nameRu: 'Чародей' },
  { id: 8, code: 'Warlock', nameRu: 'Колдун' },
  { id: 9, code: 'Wizard', nameRu: 'Волшебник' },
];

export const DEFAULT_LANGUAGE: LanguageCode =
  (process.env.DEFAULT_LANGUAGE as LanguageCode) || 'ru';
