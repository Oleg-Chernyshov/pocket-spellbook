<template>
  <q-card :style="maxWidthStyle">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md q-pa-md">
      <slot />
      <div class="row items-center justify-between">
        <q-btn
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

<script lang="ts">
export default {
  name: 'AuthCard',
};
</script>
