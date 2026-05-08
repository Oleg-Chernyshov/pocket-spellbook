import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUiStore } from 'src/stores/ui';
import type { SpellDetails } from 'src/interfaces';
import { getSpellDetails } from 'src/services/spell.service';

export function useSpellDetails() {
  const $q = useQuasar();
  const ui = useUiStore();

  const dialogOpen = ref(false);
  const details = ref<SpellDetails | null>(null);
  const loading = ref(false);

  async function loadSpellDetails(id: number): Promise<void> {
    loading.value = true;

    try {
      details.value = await getSpellDetails(id, ui.language);
      dialogOpen.value = true;
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: 'Не удалось загрузить заклинание',
      });
    } finally {
      loading.value = false;
    }
  }

  function closeDialog() {
    dialogOpen.value = false;
    details.value = null;
  }

  return {
    dialogOpen,
    details,
    loading,
    loadSpellDetails,
    closeDialog,
  };
}
