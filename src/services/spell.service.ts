import { api } from 'boot/axios';
import type {
  CharacterClass,
  LanguageCode,
  PaginatedResponse,
  SpellDetails,
  SpellListItem,
  SpellsQuery,
} from 'src/interfaces';

export async function getSpells(
  query: SpellsQuery
): Promise<PaginatedResponse<SpellListItem>> {
  const { data } = await api.get<PaginatedResponse<SpellListItem>>('/spells', {
    params: query,
  });
  return data;
}

export async function getCharacterClasses(
  language: LanguageCode
): Promise<CharacterClass[]> {
  const { data } = await api.get<CharacterClass[]>('/spells/classes', {
    params: { language },
  });
  return data;
}

export async function getSpellDetails(
  id: number,
  language: LanguageCode
): Promise<SpellDetails> {
  const { data } = await api.get<SpellDetails>(`/spells/${id}`, {
    params: { language },
  });
  return data;
}
