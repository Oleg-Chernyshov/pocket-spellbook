<template>
  <div class="ps-glass q-pa-md spell-filters">
    <div class="row items-center justify-between" :class="{ 'q-mb-sm': !isCollapsed }">
      <div class="ps-section-title">{{ t('nav.spells') }}</div>
      <div class="row items-center q-gutter-xs ps-filter-actions">
        <q-btn
          class="ps-btn"
          flat
          dense
          :icon="isCollapsed ? 'expand_more' : 'expand_less'"
          :label="isCollapsed ? t('filters.expand') : t('filters.collapse')"
          @click="toggleCollapsed"
        />
        <q-btn
          class="ps-btn"
          flat
          dense
          icon="filter_alt_off"
          :disable="!hasActiveFilters"
          :label="t('common.reset')"
          @click="emit('reset')"
        />
      </div>
    </div>

    <q-slide-transition>
      <div v-show="!isCollapsed" class="row items-center q-col-gutter-sm">
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
            :options="props.classOptions"
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
    </q-slide-transition>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocalT } from 'src/composables/useLocaleT';
import {
  SOURCE_BOOKS,
  SPELL_LEVELS,
  SPELL_SCHOOL_LABELS_RU,
  SPELL_SCHOOLS,
  type LanguageCode,
  type SpellLevel,
  type SpellSchoolFilterValue,
  type SourceBook,
} from 'src/interfaces';

interface Props {
  search: string;
  language: LanguageCode;
  classOptions: { label: string; value: number }[];
  collapsed?: boolean;
  level?: SpellLevel;
  school?: SpellSchoolFilterValue;
  characterClass?: number;
  source?: SourceBook;
}

defineOptions({ name: 'SpellFilters' })
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:level', v: SpellLevel | undefined): void;
  (e: 'update:school', v: SpellSchoolFilterValue | undefined): void;
  (e: 'update:characterClass', v: number | undefined): void;
  (e: 'update:source', v: SourceBook | undefined): void;
  (e: 'update:collapsed', v: boolean): void;
  (e: 'reset'): void;
}>();

const { t } = useLocalT();
const isRu = computed(() => props.language === 'ru');
const isCollapsed = computed({
  get: () => props.collapsed ?? false,
  set: (value: boolean) => emit('update:collapsed', value),
});

function onSearchUpdate(v: string | number | null) {
  emit('update:search', v?.toString() || '');
}

function toggleCollapsed(): void {
  isCollapsed.value = !isCollapsed.value;
}

const levels = SPELL_LEVELS.map((level) => ({ label: level, value: level }));

const schools = computed(() =>
  SPELL_SCHOOLS.map((school) => ({
    label: isRu.value ? SPELL_SCHOOL_LABELS_RU[school] : school,
    value: isRu.value ? SPELL_SCHOOL_LABELS_RU[school] : school,
  }))
);

const sources = SOURCE_BOOKS.map((source) => ({ label: source, value: source }));

const hasActiveFilters = computed(
  () =>
    !!props.search ||
    props.level !== undefined ||
    props.school !== undefined ||
    props.characterClass !== undefined ||
    props.source !== undefined
);
</script>

<style scoped>
.spell-filters :deep(.q-field__control) {
  border-radius: 12px;
}

@media (max-width: 768px) {
  .ps-filter-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
