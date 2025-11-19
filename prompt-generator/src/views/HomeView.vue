<script setup>
import { onMounted } from 'vue'
import { usePromptStore } from '@/stores/prompt'
import PromptInput from '@/components/PromptInput.vue'
import PromptList from '@/components/PromptList.vue'
import PromptPreview from '@/components/PromptPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'

const store = usePromptStore()

onMounted(() => {
  store.initStore()
})
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <PromptInput />
    <ControlPanel />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PromptList />
      <PromptPreview />
    </div>
  </div>
</template>
