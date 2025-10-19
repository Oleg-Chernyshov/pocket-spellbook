<template>
  <div class="row items-center q-col-gutter-sm">
    <div class="col-12">
      <q-input
        :model-value="search"
        @update:model-value="onSearchUpdate"
        dense
        debounce="300"
        placeholder="Поиск заклинаний"
        clearable
        filled
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-6">
      <q-select
        :model-value="level"
        @update:model-value="(v) => emit('update:level', v)"
        :options="levels"
        dense
        filled
        label="Круг"
        emit-value
        map-options
        clearable
      />
    </div>

    <div class="col-6">
      <q-select
        :model-value="school"
        @update:model-value="(v) => emit('update:school', v)"
        :options="schools"
        dense
        filled
        label="Школа"
        emit-value
        map-options
        clearable
      />
    </div>

    <div class="col-6">
      <q-select
        :model-value="characterClass"
        @update:model-value="(v) => emit('update:characterClass', v)"
        :options="classOptions"
        dense
        filled
        label="Класс"
        emit-value
        map-options
        clearable
      />
    </div>

    <div class="col-6">
      <q-select
        :model-value="source"
        @update:model-value="(v) => emit('update:source', v)"
        :options="sources"
        dense
        filled
        label="Источник"
        emit-value
        map-options
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from 'src/stores/ui';
import {
  SPELLCASTER_CLASSES,
  type SpellLevel,
  type SpellSchool,
  type SourceBook,
} from 'src/interfaces';

interface Props {
  search: string;
  level?: SpellLevel;
  school?: SpellSchool;
  characterClass?: number;
  source?: SourceBook;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:level', v: SpellLevel | undefined): void;
  (e: 'update:school', v: SpellSchool | undefined): void;
  (e: 'update:characterClass', v: number | undefined): void;
  (e: 'update:source', v: SourceBook | undefined): void;
}>();

function onSearchUpdate(v: string | number | null) {
  emit('update:search', v?.toString() || '');
}

const levels = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
] as const;

const ui = useUiStore();

const schools = computed(() =>
  [
    { enName: 'Abjuration', ruName: 'Ограждение' },
    { enName: 'Divination', ruName: 'Прорицание' },
    { enName: 'Enchantment', ruName: 'Очарование' },
    { enName: 'Evocation', ruName: 'Воплощение' },
    { enName: 'Conjuration', ruName: 'Вызов' },
    { enName: 'Illusion', ruName: 'Иллюзия' },
    { enName: 'Necromancy', ruName: 'Некромантия' },
    { enName: 'Transmutation', ruName: 'Преобразование' },
  ].map((s) => ({
    label: ui.language === 'ru' ? s.ruName : s.enName,
    value: ui.language === 'ru' ? s.ruName : s.enName,
  }))
);

const classOptions = computed(() =>
  SPELLCASTER_CLASSES.map((c) => ({
    label: ui.language === 'ru' ? c.nameRu : c.code,
    value: c.id,
  }))
);

const sources = [
  'PHB',
  'AI',
  'FTD',
  'SCPC',
  'TCoE',
  'TOEE',
  'XGTE',
  'TOEE, XGTE',
].map((s) => ({ label: s, value: s }));
</script>

<script lang="ts">
export default {
  name: 'SpellFilters',
};
</script>
