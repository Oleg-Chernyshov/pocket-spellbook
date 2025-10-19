<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <q-card>
        <q-card-section class="flex justify-between">
          <div class="text-h6">Персонаж</div>
          <q-icon
            name="settings"
            class="cursor-pointer"
            size="sm"
            flat
            @click="openSettings = !openSettings"
          />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="!openSettings && character.active">
          <div class="text-subtitle1 q-mb-sm">
            <strong>{{ name }}</strong>
          </div>

          <div class="text-caption text-grey q-mb-md">
            {{ classOptions.find((c) => c.value === classId)?.label }}
          </div>

          <SpellSlots
            :slots="spellSlots"
            :used-slots="usedSlots"
            @toggle-slot="toggleSlot"
            @reset-all="resetAllSlots"
          />
        </q-card-section>

        <q-card-section v-else>
          <q-form @submit.prevent="save">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="name"
                  label="Имя"
                  dense
                  filled
                  :rules="[(v) => !!v || 'Укажите имя']"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="classId"
                  :options="classOptions"
                  emit-value
                  map-options
                  label="Класс"
                  dense
                  filled
                  :rules="[(v) => !!v || 'Выберите класс']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12">
                <div class="text-subtitle2">Ячейки заклинаний по кругам</div>
              </div>

              <div v-for="lvl in 9" :key="lvl" class="col-6 col-md-4 col-lg-3">
                <q-input
                  v-model.number="spellSlots[String(lvl)]"
                  type="number"
                  :label="`Круг ${lvl}`"
                  dense
                  filled
                  :min="0"
                  step="1"
                />
              </div>
            </div>

            <div class="row q-mt-md">
              <div class="col-12">
                <q-btn
                  type="submit"
                  color="primary"
                  :label="character.active ? 'Сохранить' : 'Создать'"
                  :loading="saving"
                />

                <q-btn
                  v-if="character.active"
                  color="negative"
                  class="q-ml-sm"
                  label="Удалить"
                  @click="deleteDialogOpen = true"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-card v-if="character.active" class="q-mt-md">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6">Выученные заклинания</div>
            <q-btn
              color="primary"
              label="К списку заклинаний"
              icon="menu_book"
              class="q-mt-sm-xs"
              no-caps
              @click="router.push('/')"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-list>
          <SpellListItem
            v-for="s in character.spells"
            :key="s.id"
            :name="ui.language === 'ru' ? s.nameRu : s.nameEn"
            :level="s.level"
            :school="ui.language === 'ru' ? s.schoolRu : s.schoolEn"
            :range="ui.language === 'ru' ? s.rangeRu : s.rangeEn"
            :casting-time="
              ui.language === 'ru' ? s.castingTimeRu : s.castingTimeEn
            "
            @click="openSpellDetails(s)"
          >
            <template #actions>
              <q-btn
                dense
                flat
                color="negative"
                icon="delete"
                @click.stop="forget(s.id)"
              />
            </template>
          </SpellListItem>

          <q-item v-if="!character.spells.length">
            <q-item-section>Пока пусто</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <SpellDetailsDialog v-model="spellDialogOpen" :spell="selectedSpell">
      <template #actions>
        <q-btn color="negative" label="Забыть" @click="forgetFromDialog" />
      </template>
    </SpellDetailsDialog>

    <DeleteCharacterDialog
      v-model="deleteDialogOpen"
      :character-name="name"
      :loading="deleting"
      @delete="handleDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCharacterStore } from 'src/stores/character';
import { useSpellsStore } from 'src/stores/spells';
import { type CharacterSpell } from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useUiStore } from 'src/stores/ui';

import SpellDetailsDialog from 'src/components/Spells/SpellDetailsDialog.vue';
import DeleteCharacterDialog from 'src/components/Character/DeleteCharacterDialog.vue';
import SpellListItem from 'src/components/Spells/SpellListItem.vue';
import SpellSlots from 'src/components/Spells/SpellSlots.vue';

const character = useCharacterStore();
const spells = useSpellsStore();
const ui = useUiStore();
const router = useRouter();
const $q = useQuasar();

const spellDialogOpen = ref(false);
const selectedSpell = ref<CharacterSpell | null>(null);
const deleteDialogOpen = ref(false);
const deleting = ref(false);

const USED_SLOTS_STORAGE_KEY = 'ps_used_spell_slots';

function loadUsedSlotsFromStorage(
  characterId: number
): Record<string, boolean[]> {
  try {
    const stored = localStorage.getItem(
      `${USED_SLOTS_STORAGE_KEY}_${characterId}`
    );
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return createEmptyUsedSlots();
}

function saveUsedSlotsToStorage(
  characterId: number,
  slots: Record<string, boolean[]>
): void {
  try {
    localStorage.setItem(
      `${USED_SLOTS_STORAGE_KEY}_${characterId}`,
      JSON.stringify(slots)
    );
  } catch {
    // ignore storage errors
  }
}

function createEmptyUsedSlots(): Record<string, boolean[]> {
  const slots: Record<string, boolean[]> = {};
  for (let i = 1; i <= 9; i++) {
    slots[String(i)] = [];
  }
  return slots;
}

const name = ref('');
const classId = ref<number | null>(null);
const saving = ref(false);
const openSettings = ref(false);
const usedSlots = ref<Record<string, boolean[]>>(createEmptyUsedSlots());
const spellSlots = ref<Record<string, number>>({
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
});

const classOptions = computed(() =>
  spells.characterClasses.map((c) => ({
    label: ui.language === 'ru' ? `${c.titleRu} (${c.titleEn})` : c.titleEn,
    value: c.id,
  }))
);

function toggleSlot(level: string, index: number): void {
  if (!character.active) return;

  if (!usedSlots.value[level]) {
    usedSlots.value[level] = [];
  }

  usedSlots.value[level][index] = !usedSlots.value[level][index];
  saveUsedSlotsToStorage(character.active.id, usedSlots.value);
}

function resetAllSlots(): void {
  if (!character.active) return;

  usedSlots.value = createEmptyUsedSlots();
  saveUsedSlotsToStorage(character.active.id, usedSlots.value);

  $q.notify({ type: 'positive', message: 'Ячейки восстановлены' });
}

function loadCharacterData(): void {
  if (character.active) {
    name.value = character.active.name;
    classId.value = character.active.characterClassId;

    if (character.active.spellSlots) {
      for (let i = 1; i <= 9; i++) {
        const key = String(i);
        spellSlots.value[key] = character.active.spellSlots[key] ?? 0;
      }
    }

    usedSlots.value = loadUsedSlotsFromStorage(character.active.id);
  }
}

watch(
  () => character.active,
  () => {
    loadCharacterData();
  }
);

watch(
  () => ui.language,
  async (newLang) => {
    await spells.fetchCharacterClasses(newLang);
  }
);

onMounted(async () => {
  if (spells.characterClasses.length === 0) {
    await spells.fetchCharacterClasses();
  }

  if (!character.active) {
    await character.loadActive();
  }

  loadCharacterData();
});

async function save() {
  if (!name.value || !classId.value) return;

  saving.value = true;

  try {
    if (character.active) {
      await character.update(character.active.id, {
        name: name.value,
        characterClassId: classId.value,
        spellSlots: { ...spellSlots.value },
      });

      $q.notify({ type: 'positive', message: 'Сохранено' });
    } else {
      await character.create({
        name: name.value,
        characterClassId: classId.value,
        spellSlots: { ...spellSlots.value },
      });

      $q.notify({ type: 'positive', message: 'Персонаж создан' });
    }
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!character.active) return;

  deleting.value = true;
  try {
    const charId = character.active.id;
    await character.remove(charId);

    try {
      localStorage.removeItem(`${USED_SLOTS_STORAGE_KEY}_${charId}`);
    } catch {
      // ignore storage errors
    }

    name.value = '';
    classId.value = null;

    for (let i = 1; i <= 9; i++) spellSlots.value[String(i)] = 0;

    usedSlots.value = createEmptyUsedSlots();
    deleteDialogOpen.value = false;
    $q.notify({ type: 'warning', message: 'Персонаж удален' });
  } finally {
    deleting.value = false;
  }
}

function openSpellDetails(spell: CharacterSpell): void {
  selectedSpell.value = spell;
  spellDialogOpen.value = true;
}

async function forget(spellId: number) {
  if (!character.active) return;
  await character.forgetSpell(character.active.id, spellId);
  $q.notify({ type: 'warning', message: 'Заклинание забыто' });
}

async function forgetFromDialog() {
  if (!character.active || !selectedSpell.value) return;

  await character.forgetSpell(character.active.id, selectedSpell.value.id);

  spellDialogOpen.value = false;
  selectedSpell.value = null;

  $q.notify({ type: 'warning', message: 'Заклинание забыто' });
}
</script>

<style scoped>
.q-mt-sm-xs {
  @media (max-width: 600px) {
    margin-top: 10px;
  }
}
</style>
