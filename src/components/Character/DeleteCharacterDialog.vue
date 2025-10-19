<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ t('character.deleteDialog.title') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-body1">
          {{ t('character.deleteDialog.text1') }}
          <strong>{{ characterName }}</strong
          >?
        </p>
        <p class="text-body2 text-grey-7">
          {{ t('character.deleteDialog.irreversible') }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          :label="t('common.cancel')"
          color="primary"
          @click="$emit('update:modelValue', false)"
        />
        <q-btn
          :label="t('common.delete')"
          color="negative"
          :loading="loading"
          @click="handleDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useLocalT } from 'src/composables/useLocaleT';

interface Props {
  modelValue: boolean;
  characterName: string;
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'delete'): void;
}>();

const { t } = useLocalT();

function handleDelete() {
  emit('delete');
}
</script>

<script lang="ts">
export default {
  name: 'DeleteCharacterDialog',
};
</script>
