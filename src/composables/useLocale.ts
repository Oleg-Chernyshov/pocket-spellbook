import { computed } from 'vue';
import { useUiStore } from 'src/stores/ui';

export function useLocale() {
  const ui = useUiStore();
  const isRu = computed(() => ui.language === 'ru');

  function pick<T = string>(ruValue: T, enValue: T): T {
    return isRu.value ? ruValue : enValue;
  }

  function pickField<T extends object>(obj: T, baseKey: string): string {
    const o = obj as Record<string, unknown>;
    const ruKey = `${baseKey}Ru`;
    const enKey = `${baseKey}En`;
    const value = (isRu.value ? o[ruKey] : o[enKey]) as string | undefined;
    return value ?? '';
  }

  return { isRu, pick, pickField };
}
