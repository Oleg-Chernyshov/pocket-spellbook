<template>
  <q-page class="q-pa-md flex flex-center">
    <AuthCard
      title="Вход"
      submitLabel="Войти"
      :loading="loading"
      @submit="onSubmit"
      :maxWidth="420"
    >
      <q-input
        v-model="email"
        type="email"
        label="Email"
        :rules="[(val) => !!val || 'Введите email']"
        dense
        filled
      />

      <q-input
        v-model="password"
        type="password"
        label="Пароль"
        :rules="[(val) => !!val || 'Введите пароль']"
        dense
        filled
      />

      <template #alt>
        <q-btn flat to="/register" label="Регистрация" />
      </template>
    </AuthCard>
  </q-page>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const AuthCard = defineAsyncComponent(
  () => import('src/components/Auth/AuthCard.vue')
);

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const loading = ref(false);

async function onSubmit() {
  loading.value = true;

  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    $q.notify({ type: 'positive', message: 'Добро пожаловать!' });
    const redirect = (route.query.redirect as string) || '/character';
    router.replace(redirect);
  } catch {
    $q.notify({ type: 'negative', message: 'Ошибка входа' });
  } finally {
    loading.value = false;
  }
}
</script>
