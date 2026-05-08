<template>
  <q-layout :view="'lHh Lpr lFf'" class="ps-layout">
    <q-header class="ps-header">
      <div class="ps-header-inner">
        <div
          class="ps-toolbar ps-header-shell"
          :class="{
            'ps-toolbar--mobile': isMobile,
            'ps-toolbar--tablet': isTablet,
          }"
        >
          <q-btn
            unelevated
            dense
            round
            class="ps-btn ps-toolbar-btn ps-toolbar-menu"
            icon="menu"
            aria-label="Menu"
            @click="toggleDrawer"
          />

          <div class="ps-toolbar-title">
            <div class="ps-brand-chip">
              <q-avatar size="28px" class="ps-brand-avatar">
                <q-icon name="auto_stories" size="16px" />
              </q-avatar>
              <div class="ps-brand-copy ps-brand-copy--header">
                <div class="ps-brand-title">{{ t('app.title') }}</div>
                <div class="ps-brand-subtitle">
                  {{ brandSlogan }}
                </div>
              </div>
            </div>
          </div>

          <div class="ps-header-controls">
            <q-btn
              unelevated
              round
              dense
              class="ps-btn ps-toolbar-btn"
              :icon="themeIcon"
              @click="toggleDark"
            >
              <q-tooltip>{{ themeTooltip }}</q-tooltip>
            </q-btn>

            <q-btn
              unelevated
              dense
              class="ps-btn ps-toolbar-btn ps-lang-btn"
              :label="showLanguageLabel ? t('app.languageShort') : undefined"
              :icon="showLanguageLabel ? undefined : 'language'"
              @click="toggleLanguage"
            >
              <q-tooltip>{{ t('app.tooltips.language') }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      class="ps-drawer"
      :width="270"
      bordered
    >
      <div class="ps-drawer-inner">
        <div class="ps-drawer-top q-pa-md q-mb-sm">
          <div class="row items-center no-wrap">
            <q-avatar size="40px" class="ps-drawer-logo q-mr-sm">
              <q-icon name="auto_stories" size="20px" />
            </q-avatar>
            <div class="ps-brand-copy">
              <div class="ps-brand-title">{{ t('app.title') }}</div>
              <div class="ps-brand-subtitle">{{ brandSlogan }}</div>
            </div>
          </div>
        </div>

        <q-list class="q-mb-md">
        <template v-if="isAuthenticated">
          <q-item
            :active="route.name === 'spells'"
            class="ps-nav-item"
            clickable
            :to="{ name: 'spells' }"
            active-class="ps-nav-item--active"
          >
            <q-item-section avatar class="ps-nav-avatar">
              <q-icon name="menu_book" size="18px" />
            </q-item-section>
            <q-item-section>{{ t('nav.spells') }}</q-item-section>
          </q-item>

          <q-item
            :active="route.name === 'character'"
            class="ps-nav-item"
            clickable
            :to="{ name: 'character' }"
            active-class="ps-nav-item--active"
          >
            <q-item-section avatar class="ps-nav-avatar">
              <q-icon name="person" size="18px" />
            </q-item-section>
            <q-item-section>{{ t('nav.character') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item class="ps-nav-item ps-nav-item-logout" clickable @click="handleLogout">
            <q-item-section avatar class="ps-nav-avatar">
              <q-icon name="logout" size="18px" />
            </q-item-section>
            <q-item-section>{{ t('nav.logout') }}</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item class="ps-nav-item" clickable :to="{ name: 'login' }">
            <q-item-section avatar class="ps-nav-avatar">
              <q-icon name="login" size="18px" />
            </q-item-section>
            <q-item-section>{{ t('nav.login') }}</q-item-section>
          </q-item>

          <q-item class="ps-nav-item" clickable :to="{ name: 'register' }">
            <q-item-section avatar class="ps-nav-avatar">
              <q-icon name="person_add" size="18px" />
            </q-item-section>
            <q-item-section>{{ t('nav.register') }}</q-item-section>
          </q-item>
        </template>
        </q-list>

        <div class="ps-drawer-footer q-pa-sm">
          <q-btn
            unelevated
            class="full-width q-mb-sm ps-btn"
            color="primary"
            icon="auto_awesome"
            :label="t('app.actions.toggleTheme')"
            @click="toggleDark"
          />
          <q-btn
            unelevated
            class="full-width ps-btn ps-btn-secondary"
            icon="language"
            :label="t('app.actions.language')"
            @click="toggleLanguage"
          />
        </div>
      </div>
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
const isTablet = computed(() => $q.screen.lt.lg && !$q.screen.lt.sm);
const showLanguageLabel = computed(() => !$q.screen.lt.sm);
const isAuthenticated = computed(() => auth.isAuthenticated);

const leftDrawerOpen = computed({
  get: () => ui.leftDrawerOpen,
  set: (v: boolean) => ui.setDrawer(v),
});

const dark = computed(() => ui.dark);

const brandSlogan = computed(() => t('app.slogan'));
const themeIcon = computed(() => (dark.value ? 'dark_mode' : 'light_mode'));
const themeTooltip = computed(() =>
  dark.value ? t('app.tooltips.lightMode') : t('app.tooltips.darkMode')
);

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

<style scoped>
.ps-layout {
  background: transparent;
}

.ps-header {
  background: transparent;
  color: #0f172a;
}

.ps-header-inner {
  width: 100%;
  box-sizing: border-box;
  padding-left: var(--ps-page-padding);
  padding-right: var(--ps-page-padding);
}

.ps-header-shell {
  max-width: 1124px;
  margin: 0 auto;
}

.body--dark .ps-header {
  color: #e2e8f0;
}

.ps-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 70px;
  padding: 0 14px;
  border-radius: 20px;
  border: 1px solid var(--ps-surface-border);
  background: var(--ps-surface);
  box-shadow: var(--ps-shadow);
  backdrop-filter: blur(16px);
  color: inherit;
}

.ps-toolbar--tablet {
  min-height: 64px;
  padding: 0 12px;
}

.ps-toolbar--mobile {
  min-height: 58px;
  padding: 0 10px;
  border-radius: 16px;
}

.ps-toolbar-title {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.ps-header-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
}

.ps-brand-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 16px;
  padding: 6px 10px 6px 6px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(14, 165, 233, 0.12));
}

.ps-brand-avatar {
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  color: white;
  margin-right: 8px;
}

.ps-brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  gap: 2px;
}

.ps-brand-title {
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #0f172a;
}

.body--dark .ps-brand-title {
  color: #e2e8f0;
}

.ps-brand-subtitle {
  font-size: 11px;
  color: #64748b;
}

.body--dark .ps-brand-subtitle {
  color: #a5b4fc;
}

.ps-toolbar-menu {
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  color: #fff;
}

.ps-toolbar-btn {
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.16);
  min-height: 38px;
  min-width: 38px;
  color: inherit;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.ps-toolbar-btn:hover {
  transform: translateY(-1px);
  background: rgba(148, 163, 184, 0.24);
}

.ps-lang-btn {
  min-width: 60px;
  letter-spacing: 0.01em;
}

.ps-drawer :deep(.q-drawer__content) {
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.84), rgba(238, 242, 255, 0.78));
  backdrop-filter: blur(18px);
  padding-top: 0;
}

.body--dark .ps-drawer :deep(.q-drawer__content) {
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.92), rgba(15, 23, 42, 0.94));
}

.ps-drawer-inner {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 8px;
}

.ps-drawer-top {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  background: rgba(255, 255, 255, 0.5);
}

.body--dark .ps-drawer-top {
  border-color: rgba(148, 163, 184, 0.24);
  background: rgba(30, 41, 59, 0.46);
}

.ps-drawer-logo {
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  color: white;
}

.ps-drawer-footer {
  margin-top: auto;
  border-top: 1px solid rgba(148, 163, 184, 0.24);
  padding-top: 12px;
}

.ps-nav-item {
  border-radius: 14px;
  margin: 4px 0;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.ps-nav-item:hover {
  background: rgba(148, 163, 184, 0.16);
  transform: translateX(2px);
}

.ps-nav-item--active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.17), rgba(14, 165, 233, 0.13));
  color: #1d4ed8;
  font-weight: 600;
}

.ps-nav-avatar {
  min-width: 36px;
}

.ps-nav-avatar :deep(.q-icon) {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.18);
}

.ps-nav-item-logout {
  color: #ef4444;
}

.body--dark .ps-nav-item--active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.34), rgba(6, 182, 212, 0.24));
  color: #93c5fd;
}

@media (max-width: 768px) {
  .ps-brand-copy--header {
    display: none;
  }

  .ps-toolbar-btn {
    min-height: 34px;
    min-width: 34px;
  }

  .ps-lang-btn {
    min-width: 34px;
    padding: 0;
  }

  .ps-brand-avatar {
    margin-right: 0;
  }

  .ps-brand-chip {
    padding: 6px;
    min-width: 40px;
    justify-content: center;
  }

  .ps-toolbar-title {
    padding: 0 2px;
  }
}
</style>
