import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { watch } from 'vue';
import en from 'src/i18n/en';
import ru from 'src/i18n/ru';
import { useUiStore } from 'src/stores/ui';
import { Quasar } from 'quasar';
import enUS from 'quasar/lang/en-US';
import ruRU from 'quasar/lang/ru';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: (process.env.DEFAULT_LANGUAGE as 'en' | 'ru') || 'ru',
  fallbackLocale: 'en',
  messages: { en, ru },
});

export default boot(({ app }) => {
  app.use(i18n);

  const ui = useUiStore();

  // Apply UI language synchronously
  i18n.global.locale.value = ui.language;
  Quasar.lang.set(ui.language === 'ru' ? ruRU : enUS);

  watch(
    () => ui.language,
    (lang) => {
      i18n.global.locale.value = lang;
      Quasar.lang.set(lang === 'ru' ? ruRU : enUS);
    }
  );
});

export { i18n };
