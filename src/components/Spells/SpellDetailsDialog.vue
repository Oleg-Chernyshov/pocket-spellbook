<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="ps-glass spell-dialog-card">
      <q-card-section class="spell-dialog-content">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-h6">{{ normalizedName(spell?.name) }}</div>
            <div class="text-caption text-grey">
              {{ normalizedName(spell?.school) }} • {{ t('common.level') }} {{ normalizedName(spell?.level) }} • {{ normalizedName(spell?.source) }}
            </div>
          </div>
          <q-btn flat dense round icon="close" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-mb-sm">
          <b>{{ t('details.castingTime') }}:</b> {{ normalizedName(spell?.castingTime) }}
        </div>
        <div class="q-mb-sm">
          <b>{{ t('details.range') }}:</b> {{ normalizedName(spell?.range) }}
        </div>
        <div class="q-mb-sm">
          <b>{{ t('details.components') }}:</b> {{ normalizedName(spell?.components) }}
        </div>
        <div class="q-mb-sm">
          <b>{{ t('details.duration') }}:</b> {{ normalizedName(spell?.duration) }}
        </div>
        <div style="white-space: pre-wrap" v-html="sanitizedText(spell?.text)"></div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <slot name="actions"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { SpellDetails } from 'src/interfaces';
import { useLocalT } from 'src/composables/useLocaleT';
import DOMPurify from 'dompurify';

defineOptions({ name: 'SpellDetailsDialog' })

interface Props {
  modelValue: boolean;
  spell: SpellDetails | null;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { t } = useLocalT();

const normalizedName = (name: string | undefined) => {
  return name ?? '';
}

const sanitizedText = (text: string | undefined) => {
  return DOMPurify.sanitize(text ?? '', {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}
</script>

<style scoped>
.spell-dialog-card {
  max-width: 720px;
  width: min(720px, 96vw);
  border-radius: 18px;
}

.spell-dialog-content {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
