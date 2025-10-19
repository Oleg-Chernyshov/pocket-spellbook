import 'vue-i18n';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    [key: string]: string | number | boolean | DefineLocaleMessage;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, params?: Record<string, unknown>) => string;
  }
}

export {};
