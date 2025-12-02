<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="max-width: 640px; width: 100%">
      <q-card-section>
        <div class="flex justify-between items-start">
          <div>
            <div class="text-h6">{{ spellName }}</div>
            <div class="text-caption text-grey">
              {{ spellSchool }} • {{ t('common.level') }} {{ spell?.level }} •
              {{ spellSource }}
            </div>
          </div>
          <q-btn flat dense round icon="close" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-mb-sm">
          <b>{{ t('details.castingTime') }}:</b> {{ spellCastingTime }}
        </div>
        <div class="q-mb-sm">
          <b>{{ t('details.range') }}:</b> {{ spellRange }}
        </div>
        <div class="q-mb-sm">
          <b>{{ t('details.components') }}:</b> {{ spellComponents }}
        </div>

        <div v-if="spellMaterials" class="q-mb-sm">
          <b>{{ t('details.materials') }}:</b> {{ spellMaterials }}
        </div>

        <div class="q-mb-sm">
          <b>{{ t('details.duration') }}:</b> {{ spellDuration }}
        </div>
        <div style="white-space: pre-wrap" v-html="spellText"></div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <slot name="actions"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'SpellDetailsDialog',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import type { SpellDetails } from 'src/interfaces';
import { useLocalT } from 'src/composables/useLocaleT';

interface Props {
  modelValue: boolean;
  spell: SpellDetails | null;
}

const props = defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { t } = useLocalT();

const spellName = computed(() => {
  return props.spell?.name ?? '';
});

const spellSchool = computed(() => {
  return props.spell?.school ?? '';
});

const spellSource = computed(() => {
  return props.spell?.source ?? '';
});

const spellCastingTime = computed(() => {
  return props.spell?.castingTime ?? '';
});

const spellRange = computed(() => {
  return props.spell?.range ?? '';
});

const spellComponents = computed(() => {
  return props.spell?.components ?? '';
});

const spellDuration = computed(() => {
  return props.spell?.duration ?? '';
});

const spellText = computed(() => {
  return props.spell?.text ?? '';
});

const spellMaterials = computed(() => {
  return undefined; // SpellListItem не содержит materials
});
</script>
