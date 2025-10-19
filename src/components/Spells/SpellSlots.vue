<template>
  <div>
    <div class="text-subtitle2 q-mb-sm">Ячейки заклинаний</div>

    <div v-if="Object.keys(slots).length > 0">
      <div v-for="lvl in 9" :key="lvl" class="q-mb-sm">
        <div v-if="slots[String(lvl)] > 0" class="row items-center q-gutter-xs">
          <div class="text-body2" style="min-width: 40px">{{ lvl }} круг:</div>
          <q-radio
            v-for="i in slots[String(lvl)]"
            :key="i"
            :model-value="usedSlots[String(lvl)][i - 1]"
            :val="true"
            @click="$emit('toggle-slot', String(lvl), i - 1)"
            dense
          />
        </div>
      </div>
    </div>

    <q-btn
      color="primary"
      label="Долгий отдых"
      icon="refresh"
      no-caps
      @click="$emit('reset-all')"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  slots: Record<string, number>;
  usedSlots: Record<string, boolean[]>;
}

defineProps<Props>();
defineEmits<{
  (e: 'toggle-slot', level: string, index: number): void;
  (e: 'reset-all'): void;
}>();
</script>

<script lang="ts">
export default {
  name: 'SpellSlots',
};
</script>
