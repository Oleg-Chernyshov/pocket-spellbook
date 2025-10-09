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
              {{ spellSchool }} • круг {{ spell?.level }} • {{ spellSource }}
            </div>
          </div>
          <q-btn flat dense round icon="close" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-mb-sm">
          <b>Время накладывания:</b> {{ spellCastingTime }}
        </div>
        <div class="q-mb-sm"><b>Дистанция:</b> {{ spellRange }}</div>
        <div class="q-mb-sm"><b>Компоненты:</b> {{ spellComponents }}</div>

        <div v-if="spellMaterials" class="q-mb-sm">
          <b>Материалы:</b> {{ spellMaterials }}
        </div>

        <div class="q-mb-sm"><b>Длительность:</b> {{ spellDuration }}</div>
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
import { useUiStore } from 'src/stores/ui';

interface Props {
  modelValue: boolean;
  spell: SpellDetails | CharacterSpell | null;
}

const props = defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const ui = useUiStore();

const isCharacterSpell = computed(() => {
  return props.spell && 'nameRu' in props.spell;
});

const spellName = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.nameRu : spell.nameEn;
  }

  return (props.spell as SpellDetails).name;
});

const spellSchool = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.schoolRu : spell.schoolEn;
  }

  return (props.spell as SpellDetails).school;
});

const spellSource = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.sourceRu : spell.sourceEn;
  }

  return (props.spell as SpellDetails).source;
});

const spellCastingTime = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.castingTimeRu : spell.castingTimeEn;
  }

  return (props.spell as SpellDetails).castingTime;
});

const spellRange = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.rangeRu : spell.rangeEn;
  }

  return (props.spell as SpellDetails).range;
});

const spellComponents = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.componentsRu : spell.componentsEn;
  }

  return (props.spell as SpellDetails).components;
});

const spellDuration = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.durationRu : spell.durationEn;
  }

  return (props.spell as SpellDetails).duration;
});

const spellText = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.textRu : spell.textEn;
  }

  return (props.spell as SpellDetails).text;
});

const spellMaterials = computed(() => {
  if (!props.spell) return '';

  if (isCharacterSpell.value) {
    const spell = props.spell as CharacterSpell;
    return ui.language === 'ru' ? spell.materialsRu : spell.materialsEn;
  }

  return undefined;
});
</script>
