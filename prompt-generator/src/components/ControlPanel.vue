<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = usePromptStore()
const { searchQuery, markdown, items } = storeToRefs(store)
const fileInput = ref(null)

const exportMd = () => {
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'requirements.md'
  a.click()
}

const copyMd = () => navigator.clipboard.writeText(markdown.value)

const clearCompleted = () => store.clearCompleted()

const clearAll = () => store.clearAll()

const triggerImport = () => {
  fileInput.value.click()
}

const handleImport = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (Array.isArray(data)) {
        // Assuming it's just the items array
        store.items = data
      } else if (data.items && Array.isArray(data.items)) {
        // Assuming it's a full backup object
        store.items = data.items
        if (data.encoding) store.encoding = data.encoding
        if (data.customPrompt) store.customPrompt = data.customPrompt
        if (data.selectedMcps) store.selectedMcps = data.selectedMcps
        if (data.toggles) store.toggles = data.toggles
      }
      alert('Import successful!')
    } catch (err) {
      console.error(err)
      alert('Failed to import: Invalid JSON')
    }
  }
  reader.readAsText(file)
  // Reset input
  event.target.value = ''
}

const exportJson = () => {
  const data = {
    items: items.value,
    encoding: store.encoding,
    customPrompt: store.customPrompt,
    selectedMcps: store.selectedMcps,
    toggles: store.toggles
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'prompt-generator-backup.json'
  a.click()
}
</script>

<template>
  <div class="flex gap-2 mb-4 flex-wrap">
    <input v-model="searchQuery" :placeholder="t('home.searchPlaceholder')" class="input input-bordered flex-1 min-w-[200px]" />
    
    <div class="join">
      <button @click="exportMd" class="btn btn-outline join-item">{{ t('home.exportButton') }}</button>
      <button @click="copyMd" class="btn btn-outline join-item">{{ t('home.copyButton') }}</button>
    </div>

    <div class="join">
      <button @click="exportJson" class="btn btn-outline join-item">Backup JSON</button>
      <button @click="triggerImport" class="btn btn-outline join-item">Import JSON</button>
    </div>
    <input type="file" ref="fileInput" @change="handleImport" accept=".json" class="hidden" />

    <div class="join">
      <button @click="clearCompleted" class="btn btn-outline join-item">{{ t('home.clearCompleted') }}</button>
      <button @click="clearAll" class="btn btn-outline btn-error join-item">{{ t('home.clearAll') }}</button>
    </div>
  </div>
</template>
