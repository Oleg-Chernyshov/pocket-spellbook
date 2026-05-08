<template>
  <div>
    <div class="text-subtitle2 q-mb-sm">{{ t('character.spellSlots') }}</div>

    <div v-if="Object.keys(slots).length > 0">
      <div v-for="lvl in 9" :key="lvl" class="q-mb-sm">
        <div
          v-if="slots[String(lvl)] > 0"
          class="row items-center q-gutter-xs ps-slot-level"
        >
          <div class="text-body2 ps-slot-label">
            {{ lvl }} {{ t('common.level') }}:
          </div>
          <q-radio
            v-for="i in slots[String(lvl)]"
            :key="i"
            dense
            :model-value="usedSlots[String(lvl)][i - 1]"
            :val="true"
            :color="usedSlots[String(lvl)][i - 1] ? 'negative' : 'primary'"
            @click="$emit('toggle-slot', String(lvl), i - 1)"
          />
        </div>
      </div>
    </div>

    <q-btn
      color="primary"
      :label="t('character.longRest')"
      icon="refresh"
      no-caps
      @click="$emit('reset-all')"
    />
  </div>
</template>

<script setup lang="ts">
import { useLocalT } from 'src/composables/useLocaleT';

const { t } = useLocalT();

interface Props {
  slots: Record<string, number>;
  usedSlots: Record<string, boolean[]>;
}

defineOptions({ name: 'SpellSlots' })
defineProps<Props>();
defineEmits<{
  (e: 'toggle-slot', level: string, index: number): void;
  (e: 'reset-all'): void;
}>();
</script>

<style scoped>
.ps-slot-level {
  padding: 6px 0;
}

.ps-slot-label {
  width: 50px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>