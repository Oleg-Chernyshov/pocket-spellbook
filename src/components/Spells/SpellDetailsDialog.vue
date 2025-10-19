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
import type { SpellDetails, CharacterSpell } from 'src/interfaces';
import { useLocalT } from 'src/composables/useLocaleT';
import { useLocale } from 'src/composables/useLocale';

interface Props {
  modelValue: boolean;
  spell: SpellDetails | CharacterSpell | null;
}

const props = defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { t } = useLocalT();
const { pickField } = useLocale();

const isCharacterSpell = computed(() => {
  return props.spell && 'nameRu' in props.spell;
});

const spellName = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'name');
  }

  return (props.spell as SpellDetails).name;
});

const spellSchool = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'school');
  }

  return (props.spell as SpellDetails).school;
});

const spellSource = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'source');
  }

  return (props.spell as SpellDetails).source;
});

const spellCastingTime = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'castingTime');
  }

  return (props.spell as SpellDetails).castingTime;
});

const spellRange = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'range');
  }

  return (props.spell as SpellDetails).range;
});

const spellComponents = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'components');
  }

  return (props.spell as SpellDetails).components;
});

const spellDuration = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'duration');
  }

  return (props.spell as SpellDetails).duration;
});

const spellText = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'text');
  }

  return (props.spell as SpellDetails).text;
});

const spellMaterials = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    return pickField(props.spell as CharacterSpell, 'materials');
  }

  return undefined;
});
</script>
