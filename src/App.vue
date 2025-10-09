<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUiStore } from 'src/stores/ui';

const $q = useQuasar();
const ui = useUiStore();

onMounted(() => {
  $q.dark.set(ui.dark);
});
</script>
