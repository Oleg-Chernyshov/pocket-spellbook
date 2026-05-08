<template>
  <q-item clickable class="ps-spell-item q-pa-sm" @click="$emit('click')">
    <q-item-section>
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <div class="text-subtitle1 text-weight-medium">{{ name }}</div>
        </div>
        <div class="col-auto">
          <q-badge color="primary" rounded>
            {{ levelLabel }} {{ level }}
          </q-badge>
        </div>
      </div>
      <div class="text-caption ps-meta q-mt-xs">
        <q-icon name="auto_awesome" size="14px" class="q-mr-xs" />
        {{ school }}
      </div>
      <div class="text-caption ps-meta">
        <q-icon name="swap_horiz" size="14px" class="q-mr-xs" />
        {{ range }} ·
        <q-icon name="schedule" size="14px" class="q-mx-xs" />
        {{ castingTime }}
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

defineOptions({ name: 'SpellListItem' })
defineProps<Props>();
defineEmits<{
  (e: 'click'): void;
}>();

const levelLabel = computed(() => t('common.level'));
</script>

<style scoped>
.ps-spell-item {
  border-radius: 14px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.ps-spell-item:hover {
  background: rgba(148, 163, 184, 0.12);
  transform: translateY(-1px);
}

.ps-meta {
  display: flex;
  align-items: center;
  color: #64748b;
}

.body--dark .ps-meta {
  color: #94a3b8;
}
</style>
