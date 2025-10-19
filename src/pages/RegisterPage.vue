<template>
  <q-page class="q-pa-md flex flex-center">
    <AuthCard
      title="Регистрация"
      submitLabel="Создать"
      :loading="loading"
      @submit="onSubmit"
      :maxWidth="480"
    >
      <q-input
        v-model="name"
        label="Имя"
        :rules="[(val) => !!val || 'Введите имя']"
        dense
        filled
      />

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
        <q-btn flat to="/login" label="Войти" />
      </template>
    </AuthCard>
  </q-page>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const AuthCard = defineAsyncComponent(
  () => import('src/components/Auth/AuthCard.vue')
);

const name = ref('');
const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const loading = ref(false);

async function onSubmit() {
  loading.value = true;

  try {
    await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
    });

    $q.notify({ type: 'positive', message: 'Регистрация выполнена' });
    router.replace('/character');
  } catch {
    $q.notify({ type: 'negative', message: 'Ошибка регистрации' });
  } finally {
    loading.value = false;
  }
}
</script>
