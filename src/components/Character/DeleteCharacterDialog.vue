<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Удаление персонажа</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-body1">
          Вы уверены, что хотите удалить персонажа
          <strong>{{ characterName }}</strong
          >?
        </p>
        <p class="text-body2 text-grey-7">
          Это действие нельзя отменить. Все выученные заклинания и настройки
          персонажа будут потеряны.
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="primary"
          @click="$emit('update:modelValue', false)"
        />
        <q-btn
          label="Удалить"
          color="negative"
          :loading="loading"
          @click="handleDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  characterName: string;
  loading?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'delete'): void;
}>();

function handleDelete() {
  emit('delete');
}
</script>

<script lang="ts">
export default {
  name: 'DeleteCharacterDialog',
};
</script>
