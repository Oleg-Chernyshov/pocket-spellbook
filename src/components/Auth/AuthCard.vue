<template>
  <q-card :style="maxWidthStyle" class="ps-glass auth-card">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md q-pa-md">
      <slot />
      <div class="row items-center justify-between">
        <q-btn
          class="ps-btn"
          type="submit"
          color="primary"
          :loading="loading"
          :label="submitLabel"
        />
        <slot name="alt" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  submitLabel: string;
  loading?: boolean;
  maxWidth?: number;
}

defineOptions({ name: 'AuthCard' })
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'submit'): void }>();

const maxWidthStyle = computed(() => ({
  maxWidth: `${props.maxWidth ?? 480}px`,
  width: '100%',
}));

function onSubmit() {
  emit('submit');
}
</script>

<style scoped>
.auth-card {
  border-radius: 20px;
}

.auth-card :deep(.q-field__control) {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.76);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.auth-card :deep(.q-field__control:before),
.auth-card :deep(.q-field__control:after) {
  z-index: 1;
}

.body--dark .auth-card :deep(.q-field__control) {
  background: rgba(30, 41, 59, 0.6);
}

.auth-card :deep(.q-field--focused .q-field__control) {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.22);
}

.auth-card :deep(.q-field__label) {
  font-weight: 500;
}

/* Keep browser autofill consistent with our field design */
.auth-card :deep(input:-webkit-autofill),
.auth-card :deep(input:-webkit-autofill:hover),
.auth-card :deep(input:-webkit-autofill:focus),
.auth-card :deep(input:-internal-autofill-selected),
.auth-card :deep(textarea:-webkit-autofill),
.auth-card :deep(textarea:-webkit-autofill:hover),
.auth-card :deep(textarea:-webkit-autofill:focus),
.auth-card :deep(textarea:-internal-autofill-selected),
.auth-card :deep(select:-internal-autofill-selected),
.auth-card :deep(select:-webkit-autofill) {
  -webkit-text-fill-color: inherit;
  color: inherit !important;
  caret-color: inherit;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  transition: background-color 9999s ease-out 0s;
}

.body--dark .auth-card :deep(input:-webkit-autofill),
.body--dark .auth-card :deep(input:-webkit-autofill:hover),
.body--dark .auth-card :deep(input:-webkit-autofill:focus),
.body--dark .auth-card :deep(input:-internal-autofill-selected),
.body--dark .auth-card :deep(textarea:-webkit-autofill),
.body--dark .auth-card :deep(textarea:-webkit-autofill:hover),
.body--dark .auth-card :deep(textarea:-webkit-autofill:focus),
.body--dark .auth-card :deep(textarea:-internal-autofill-selected),
.body--dark .auth-card :deep(select:-internal-autofill-selected),
.body--dark .auth-card :deep(select:-webkit-autofill) {
  -webkit-text-fill-color: #e2e8f0 !important;
  color: #e2e8f0 !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}
</style>
