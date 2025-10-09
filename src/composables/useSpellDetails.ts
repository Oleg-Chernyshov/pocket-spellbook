import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useUiStore } from 'src/stores/ui';
import type { SpellDetails } from 'src/interfaces';

export function useSpellDetails() {
  const $q = useQuasar();
  const ui = useUiStore();

  const dialogOpen = ref(false);
  const details = ref<SpellDetails | null>(null);
  const loading = ref(false);

  async function loadSpellDetails(id: number) {
    loading.value = true;
    try {
      const { data } = await api.get<SpellDetails>(`/spells/${id}`, {
        params: { language: ui.language },
      });
      details.value = data;
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
