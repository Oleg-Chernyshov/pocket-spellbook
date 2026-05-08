<template>
  <div class="row items-center q-col-gutter-sm">
    <div class="col-12">
      <q-input
        :model-value="search"
        @update:model-value="onSearchUpdate"
        dense
        debounce="300"
        :placeholder="t('filters.searchPlaceholder')"
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
        :label="t('filters.level')"
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
        :label="t('filters.school')"
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
        :label="t('filters.class')"
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
        :label="t('filters.source')"
        emit-value
        map-options
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSpellsStore } from 'src/stores/spells';
import { useLocalT } from 'src/composables/useLocaleT';
import {
  SOURCE_BOOKS,
  SPELL_LEVELS,
  SPELL_SCHOOLS,
  type SpellLevel,
  type SpellSchool,
  type SpellSchoolFilterValue,
  type SourceBook,
} from 'src/interfaces';

interface Props {
  search: string;
  level?: SpellLevel;
  school?: SpellSchoolFilterValue;
  characterClass?: number;
  source?: SourceBook;
}

defineOptions({ name: 'SpellFilters' })
defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:level', v: SpellLevel | undefined): void;
  (e: 'update:school', v: SpellSchoolFilterValue | undefined): void;
  (e: 'update:characterClass', v: number | undefined): void;
  (e: 'update:source', v: SourceBook | undefined): void;
}>();

const spellsStore = useSpellsStore();
const { t } = useLocalT();
const isRu = computed(() => spellsStore.language === 'ru');

onMounted(() => {
  if (spellsStore.characterClasses.length === 0) {
    spellsStore.fetchCharacterClasses();
  }
});

function onSearchUpdate(v: string | number | null) {
  emit('update:search', v?.toString() || '');
}

const SCHOOL_LABELS_RU: Record<SpellSchool, string> = {
  Abjuration: 'Ограждение',
  Conjuration: 'Вызов',
  Divination: 'Прорицание',
  Enchantment: 'Очарование',
  Evocation: 'Воплощение',
  Illusion: 'Иллюзия',
  Necromancy: 'Некромантия',
  Transmutation: 'Преобразование',
};

const levels = SPELL_LEVELS.map((level) => ({ label: level, value: level }));

const schools = computed(() =>
  SPELL_SCHOOLS.map((school) => ({
    label: isRu.value ? SCHOOL_LABELS_RU[school] : school,
    value: isRu.value ? SCHOOL_LABELS_RU[school] : school,
  }))
);

const classOptions = computed(() =>
  spellsStore.spellcasterClasses.map((c) => ({
    label: isRu.value ? c.titleRu : c.titleEn,
    value: c.id,
  }))
);

const sources = SOURCE_BOOKS.map((source) => ({ label: source, value: source }));
</script>
