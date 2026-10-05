import { aiApi } from 'boot/axios';
import type { PaginatedResponse, SpellListItem, SpellsQuery } from 'src/interfaces';

export async function smartSearchSpells(
  query: SpellsQuery
): Promise<PaginatedResponse<SpellListItem>> {
  const { search, ...rest } = query;
  const { data } = await aiApi.get<PaginatedResponse<SpellListItem>>('/search', {
    params: {
      ...rest,
      q: search,
    },
  });
  return data;
}
