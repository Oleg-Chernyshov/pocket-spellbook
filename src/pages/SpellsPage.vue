<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <SpellFilters
        :search="search"
        :level="level"
        :school="school"
        :character-class="characterClass"
        :source="source"
        @update:search="(v) => (search = v)"
        @update:level="(v) => (level = v)"
        @update:school="(v) => (school = v)"
        @update:characterClass="(v) => (characterClass = v)"
        @update:source="(v) => (source = v)"
      />

      <div>
        <q-list separator>
          <q-infinite-scroll @load="onLoad" :offset="250">
            <template v-for="spell in items" :key="spell.id">
              <SpellListItem
                :name="spell.name"
                :level="spell.level"
                :school="spell.school"
                :range="spell.range"
                :casting-time="spell.castingTime"
                @click="openSpell(spell.id)"
              />
              <q-separator />
            </template>

            <template #loading>
              <div class="row justify-center q-my-md">
                <q-spinner color="primary" size="2em" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
      </div>
    </div>

    <SpellDetailsDialog v-model="dialogOpen" :spell="details">
      <template #actions>
        <q-btn
          v-if="!character.active"
          color="primary"
          label="Создать персонажа"
          icon="person_add"
          @click="router.push('/character')"
        />
        <q-btn
          v-else
          :color="!canLearn ? 'negative' : 'primary'"
          :label="!canLearn ? 'Забыть' : 'Выучить'"
          @click="!canLearn ? forget() : learn()"
        />
      </template>
    </SpellDetailsDialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSpellsStore } from 'src/stores/spells';
import { useCharacterStore } from 'src/stores/character';
import {
  CHARACTER_CLASSES,
  SPELLCASTER_CLASSES,
  type CharacterClassCode,
  type SpellLevel,
  type SpellSchool,
  type SourceBook,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { useUiStore } from 'src/stores/ui';
import { useSpellDetails } from 'src/composables/useSpellDetails';

import SpellDetailsDialog from 'src/components/Spells/SpellDetailsDialog.vue';
import SpellFilters from 'src/components/Spells/SpellFilters.vue';
import SpellListItem from 'src/components/Spells/SpellListItem.vue';

const spells = useSpellsStore();
const character = useCharacterStore();
const auth = useAuthStore();
const ui = useUiStore();
const router = useRouter();
const $q = useQuasar();

const { dialogOpen, details, loadSpellDetails } = useSpellDetails();

const search = ref(spells.search);
const level = ref<SpellLevel | undefined>(spells.level);
const school = ref<SpellSchool | undefined>(spells.school);
const characterClass = ref<CharacterClassCode | undefined>(
  spells.characterClass as CharacterClassCode | undefined
);
const source = ref<SourceBook | undefined>(spells.source);

const items = computed(() => spells.items);

async function onLoad(index: number, done: () => void) {
  try {
    await spells.fetchNext();
  } finally {
    done();
  }
}

watch([search, level, school, characterClass, source], async () => {
  spells.setFilters({
    search: search.value,
    level: level.value,
    school: school.value,
    characterClass: characterClass.value,
    source: source.value,
  });

  await spells.resetAndFetch();
});

function openSpell(id: number) {
  loadSpellDetails(id);
}

const canLearn = computed(() => {
  if (!character.active || !details.value) return false;
  const targetId = details.value?.id;

  if (!targetId) return false;
  return !character.spells.some((s) => s.id === targetId);
});

async function learn() {
  if (!character.active || !details.value) return;
  await character.learnSpell(character.active.id, details.value.id);

  $q.notify({ type: 'positive', message: 'Заклинание выучено' });
}

async function forget() {
  if (!character.active || !details.value) return;
  await character.forgetSpell(character.active.id, details.value.id);

  $q.notify({ type: 'warning', message: 'Заклинание забыто' });
}

watch(
  () => character.active?.characterClassId,
  (newClassId) => {
    if (newClassId) {
      const charClass = CHARACTER_CLASSES.find((c) => c.id === newClassId);

      const isSpellcaster = SPELLCASTER_CLASSES.some(
        (sc) => sc.id === charClass?.id
      );

      if (charClass && isSpellcaster) {
        characterClass.value = charClass.code;
      } else {
        characterClass.value = undefined;
      }
    }
  }
);

watch(
  () => ui.language,
  async (newLang) => {
    spells.setLanguage(newLang);
    await spells.resetAndFetch();
  }
);

onMounted(async () => {
  try {
    if (auth.isAuthenticated && !character.active) {
      await character.loadActive();
    }

    if (character.active) {
      const charClass = CHARACTER_CLASSES.find(
        (c) => c.id === character.active?.characterClassId
      );

      const isSpellcaster = SPELLCASTER_CLASSES.some(
        (sc) => sc.id === charClass?.id
      );

      if (charClass && isSpellcaster) {
        characterClass.value = charClass.code;
      } else {
        characterClass.value = undefined;
      }
    }
  } catch (e: unknown) {
    // ignore errors
  } finally {
    if (spells.items.length === 0) {
      await spells.resetAndFetch();
    }
  }
});
</script>
