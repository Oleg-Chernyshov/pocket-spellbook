import { getCurrentInstance, type ComponentPublicInstance } from 'vue';

export type I18nT = (key: string, params?: Record<string, unknown>) => string;

export function useLocalT() {
  const instance = getCurrentInstance();
  const proxy = instance?.proxy as ComponentPublicInstance & { $t?: I18nT };

  const t: I18nT = (key, params) => (proxy?.$t ? proxy.$t(key, params) : key);

  return { t };
}
