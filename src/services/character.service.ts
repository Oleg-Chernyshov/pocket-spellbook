import { api } from 'boot/axios';
import type {
  Character,
  CreateCharacterDto,
  LanguageCode,
  SpellListItem,
  UpdateCharacterDto,
} from 'src/interfaces';

export async function getCharacters(): Promise<Character[]> {
  const { data } = await api.get<Character[]>('/characters');
  return data;
}

export async function createCharacter(dto: CreateCharacterDto): Promise<Character> {
  const { data } = await api.post<Character>('/characters', dto);
  return data;
}

export async function updateCharacter(
  id: number,
  dto: UpdateCharacterDto
): Promise<Character> {
  const { data } = await api.put<Character>(`/characters/${id}`, dto);
  return data;
}

export async function deleteCharacter(id: number): Promise<void> {
  await api.delete(`/characters/${id}`);
}

export async function getSpells(
  id: number,
  language?: LanguageCode
): Promise<SpellListItem[]> {
  const { data } = await api.get<SpellListItem[]>(`/characters/${id}/spells`, {
    params: language ? { language } : undefined,
  });
  return data;
}

export async function learnSpell(id: number, spellId: number): Promise<void> {
  await api.post(`/characters/${id}/spells/${spellId}`);
}

export async function forgetSpell(id: number, spellId: number): Promise<void> {
  await api.delete(`/characters/${id}/spells/${spellId}`);
}