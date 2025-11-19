<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePromptStore } from '@/stores/prompt'

const { t } = useI18n()
const store = usePromptStore()

const newItem = ref({ text: '', priority: 'high', tags: '' })

const addItem = () => {
  if (!newItem.value.text.trim()) return
  store.addItem(newItem.value)
  newItem.value = { text: '', priority: 'high', tags: '' }
}
</script>

<template>
  <div class="card bg-base-100 shadow mb-4 transition-all duration-100 hover:shadow-2xl">
    <div class="card-body">
      <textarea 
        v-model="newItem.text" 
        @keydown.ctrl.enter="addItem" 
        @keydown.meta.enter="addItem" 
        :placeholder="t('home.inputPlaceholder')" 
        class="textarea textarea-bordered w-full" 
        rows="3"
      ></textarea>
      <div class="flex gap-2 mt-2">
        <select v-model="newItem.priority" class="select select-bordered">
          <option value="high">{{ t('home.priority.high') }}</option>
          <option value="medium">{{ t('home.priority.medium') }}</option>
          <option value="low">{{ t('home.priority.low') }}</option>
        </select>
        <input 
          v-model="newItem.tags" 
          @keydown.enter="addItem" 
          :placeholder="t('home.tagsPlaceholder')" 
          class="input input-bordered flex-1" 
        />
        <button @click="addItem" class="btn btn-primary">{{ t('home.addButton') }}</button>
      </div>
    </div>
  </div>
</template>
