<template>
  <q-page class="q-pa-md flex flex-center">
    <AuthCard
      :title="t('auth.register.title')"
      :submitLabel="t('auth.register.submit')"
      :loading="loading"
      @submit="onSubmit"
      :maxWidth="480"
    >
      <q-input
        v-model="name"
        :label="t('auth.register.name')"
        :rules="[(val) => !!val || t('auth.register.nameRequired')]"
        dense
        filled
      />

      <q-input
        v-model="email"
        type="email"
        :label="t('auth.common.email')"
        :rules="[(val) => !!val || t('auth.register.emailRequired')]"
        dense
        filled
      />

      <q-input
        v-model="password"
        type="password"
        :label="t('auth.common.password')"
        :rules="[(val) => !!val || t('auth.register.passwordRequired')]"
        dense
        filled
      />

      <template #alt>
        <q-btn flat to="/login" :label="t('auth.register.loginLink')" />
      </template>
    </AuthCard>
  </q-page>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { useLocalT } from 'src/composables/useLocaleT';

const AuthCard = defineAsyncComponent(
  () => import('src/components/Auth/AuthCard.vue')
);

const name = ref('');
const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const { t } = useLocalT();

const loading = ref(false);

async function onSubmit() {
  loading.value = true;

  try {
    await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
    });

    $q.notify({ type: 'positive', message: t('auth.register.success') });
    router.replace('/character');
  } catch {
    $q.notify({ type: 'negative', message: t('auth.register.error') });
  } finally {
    loading.value = false;
  }
}
</script>
