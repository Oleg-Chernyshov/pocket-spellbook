<template>
  <q-layout :view="isMobile ? 'lHh Lpr lFf' : 'hHh LpR lFf'">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title>{{ t('app.title') }}</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="dark ? 'dark_mode' : 'light_mode'"
          @click="toggleDark"
        />

        <q-btn
          flat
          dense
          :label="language === 'ru' ? 'RU' : 'EN'"
          @click="toggleLanguage"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered side="left">
      <q-list>
        <template v-if="isAuthenticated">
          <q-item
            :active="route.name === 'spells'"
            clickable
            :to="{ name: 'spells' }"
            active-class="text-primary"
          >
            <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
            <q-item-section>{{ t('nav.spells') }}</q-item-section>
          </q-item>

          <q-item
            :active="route.name === 'character'"
            clickable
            :to="{ name: 'character' }"
            active-class="text-primary"
          >
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>{{ t('nav.character') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable @click="handleLogout">
            <q-item-section avatar><q-icon name="logout" /></q-item-section>
            <q-item-section>{{ t('nav.logout') }}</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item clickable :to="{ name: 'login' }">
            <q-item-section avatar><q-icon name="login" /></q-item-section>
            <q-item-section>{{ t('nav.login') }}</q-item-section>
          </q-item>

          <q-item clickable :to="{ name: 'register' }">
            <q-item-section avatar><q-icon name="person_add" /></q-item-section>
            <q-item-section>{{ t('nav.register') }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from 'src/stores/ui';
import { useAuthStore } from 'src/stores/auth';
import { useLocalT } from 'src/composables/useLocaleT';

const $q = useQuasar();
const { t } = useLocalT();
const ui = useUiStore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const isMobile = computed(() => $q.screen.lt.md);
const isAuthenticated = computed(() => auth.isAuthenticated);

const leftDrawerOpen = computed({
  get: () => ui.leftDrawerOpen,
  set: (v: boolean) => ui.setDrawer(v),
});

const dark = computed({
  get: () => ui.dark,
  set: (v: boolean) => (ui.dark = v),
});

const language = computed(() => ui.language);

function toggleDrawer() {
  ui.toggleDrawer();
}

function toggleDark() {
  ui.toggleDark();
  $q.dark.set(ui.dark);
}

function toggleLanguage() {
  const newLang = ui.language === 'ru' ? 'en' : 'ru';
  ui.setLanguage(newLang);
}

function handleLogout() {
  auth.logout();
  router.push({ name: 'login' });
  $q.notify({ type: 'info', message: t('auth.loggedOut') });
}
</script>
