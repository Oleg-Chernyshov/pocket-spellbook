<template>
  <q-page class="q-pa-md">
    <div class="ps-shell ps-stack-md">
      <q-card class="ps-glass">
        <q-card-section class="row items-center justify-between q-col-gutter-sm">
          <div class="col">
            <div class="text-h6">{{ t('character.listTitle') }}</div>
            <div class="text-caption ps-subtle q-mt-xs">
              {{ t('character.listHint') }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              class="ps-btn"
              color="primary"
              icon="person_add"
              :label="t('character.createNew')"
              @click="openCreate = !openCreate"
            />
          </div>
        </q-card-section>

        <q-separator v-if="openCreate" />

        <q-card-section v-if="openCreate">
          <q-form @submit.prevent="create">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="name"
                  :label="t('character.name')"
                  dense
                  filled
                  :rules="[(v) => !!v || t('character.nameRequired')]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="classId"
                  :options="classOptions"
                  emit-value
                  map-options
                  :label="t('character.class')"
                  dense
                  filled
                  :rules="[(v) => !!v || t('character.classRequired')]"
                />
              </div>
            </div>
            <div class="row q-mt-md">
              <q-btn
                class="ps-btn"
                type="submit"
                color="primary"
                :label="t('common.create')"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-card class="ps-glass">
        <q-list v-if="character.list.length">
          <q-item
            v-for="item in character.list"
            :key="item.id"
            clickable
            class="ps-character-item"
            @click="openCharacter(item.id)"
          >
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption>
                {{ classLabel(item.characterClassId) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption ps-subtle">
                {{ t('character.spellsCount', { count: item.spellsCount ?? 0 }) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-section v-else>
          {{ t('character.emptyList') }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';
import { useSpellsStore } from 'src/stores/spells';
import { useUiStore } from 'src/stores/ui';
import { useLocalT } from 'src/composables/useLocaleT';

const character = useCharacterStore();
const spells = useSpellsStore();
const ui = useUiStore();
const { t } = useLocalT();
const router = useRouter();
const $q = useQuasar();

const openCreate = ref(false);
const saving = ref(false);
const name = ref('');
const classId = ref<number | null>(null);

const classOptions = computed(() =>
  spells.characterClasses.map((c) => ({
    label: ui.language === 'ru' ? c.titleRu || c.titleEn : c.titleEn,
    value: c.id,
  }))
);

onMounted(async () => {
  if (spells.characterClasses.length === 0) {
    await spells.fetchCharacterClasses(ui.language);
  }

  await character.loadList();
});

function classLabel(id: number): string {
  return classOptions.value.find((option) => option.value === id)?.label || '';
}

function openCharacter(id: number): void {
  router.push({ name: 'character', params: { id: String(id) } });
}

function isConflict(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response?: { status?: number } }).response?.status === 409
  );
}

async function create(): Promise<void> {
  if (!name.value || !classId.value) return;

  saving.value = true;
  try {
    await character.create(
      {
        name: name.value,
        characterClassId: classId.value,
      },
      ui.language
    );
    $q.notify({ type: 'positive', message: t('character.created') });
    if (character.active) {
      router.push({
        name: 'character',
        params: { id: String(character.active.id) },
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: isConflict(error)
        ? t('character.limitReached')
        : t('character.createError'),
    });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.ps-character-item {
  border-radius: 14px;
  margin: 4px 8px;
}

:deep(.q-card) {
  border-radius: 18px;
}

:deep(.q-btn) {
  border-radius: 12px;
}
</style>
