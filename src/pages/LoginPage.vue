<template>
  <q-page class="q-pa-md flex flex-center">
    <AuthCard
      :title="t('auth.login.title')"
      :submitLabel="t('auth.login.submit')"
      :loading="loading"
      @submit="onSubmit"
      :maxWidth="420"
    >
      <q-input
        v-model="email"
        type="email"
        :label="t('auth.common.email')"
        :rules="[(val) => !!val || t('auth.login.emailRequired')]"
        dense
        filled
      />

      <q-input
        v-model="password"
        type="password"
        :label="t('auth.common.password')"
        :rules="[(val) => !!val || t('auth.login.passwordRequired')]"
        dense
        filled
      />

      <template #alt>
        <q-btn flat to="/register" :label="t('auth.login.registerLink')" />
      </template>
    </AuthCard>
  </q-page>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { useLocalT } from 'src/composables/useLocaleT';

const AuthCard = defineAsyncComponent(
  () => import('src/components/Auth/AuthCard.vue')
);

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const { t } = useLocalT();

const loading = ref(false);

async function onSubmit() {
  loading.value = true;

  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    $q.notify({ type: 'positive', message: t('auth.login.success') });
    const redirect = (route.query.redirect as string) || '/character';
    router.replace(redirect);
  } catch {
    $q.notify({ type: 'negative', message: t('auth.login.error') });
  } finally {
    loading.value = false;
  }
}
</script>
