<template>
  <q-item clickable @click="$emit('click')">
    <q-item-section>
      <div class="text-subtitle1">
        {{ name }}
        <span class="text-caption">({{ levelLabel }} {{ level }})</span>
      </div>
      <div class="text-caption text-grey">
        {{ school }} • {{ range }} • {{ castingTime }}
      </div>
    </q-item-section>
    <q-item-section v-if="$slots.actions" side top>
      <slot name="actions" />
    </q-item-section>
    <q-item-section v-else side top>
      <q-icon name="chevron_right" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocalT } from 'src/composables/useLocaleT';
const { t } = useLocalT();

interface Props {
  name: string;
  level: string | number;
  school: string;
  range: string;
  castingTime: string;
}

defineProps<Props>();
defineEmits<{
  (e: 'click'): void;
}>();

const levelLabel = computed(() => t('common.level'));
</script>

<script lang="ts">
export default {
  name: 'SpellListItem',
};
</script>
