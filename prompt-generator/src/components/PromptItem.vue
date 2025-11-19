<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePromptStore } from '@/stores/prompt'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()
const store = usePromptStore()
const fileInput = ref('')

const addFile = () => {
  if (fileInput.value?.trim()) {
    store.addFileToItem(props.item.id, fileInput.value)
    fileInput.value = ''
  }
}

const removeFile = (fileIndex) => {
  store.removeFileFromItem(props.item.id, fileIndex)
}

const deleteItem = () => {
  store.deleteItem(props.index)
}

const moveTop = () => {
  store.moveTop(props.index)
}

const moveBottom = () => {
  store.moveBottom(props.index)
}
</script>

<template>
  <div class="card bg-base-100 shadow cursor-move transition-all duration-100 hover:shadow-xl" @click="item.editing = false">
    <div class="card-body p-4">
      <div class="flex items-start gap-2">
        <input type="checkbox" v-model="item.completed" class="checkbox" />
        <div class="flex-1 min-w-0">
          <div v-if="!item.editing" @dblclick="item.editing = true" class="cursor-pointer">
            <span class="break-words whitespace-pre-wrap" :class="{'line-through': item.completed}">{{ item.text }}</span>
            <div class="flex gap-1 mt-1">
              <span class="badge" :class="{'badge-error': item.priority === 'high', 'badge-warning': item.priority === 'medium', 'badge-info': item.priority === 'low'}">{{ t(`home.priority.${item.priority}`) }}</span>
              <span v-for="tag in item.tags" :key="tag" class="badge badge-outline">{{ tag }}</span>
            </div>
          </div>
          <div v-else class="space-y-2" @click.stop>
            <textarea v-model="item.text" @keydown.enter.exact="item.editing = false" class="textarea textarea-bordered w-full" rows="2"></textarea>
            <select v-model="item.priority" class="select select-bordered select-sm w-full">
              <option value="high">{{ t('home.priority.high') }}</option>
              <option value="medium">{{ t('home.priority.medium') }}</option>
              <option value="low">{{ t('home.priority.low') }}</option>
            </select>
          </div>
          <div v-if="item.files.length" class="text-xs mt-2 space-y-1">
            <div v-for="(f, i) in item.files" :key="i" class="flex items-center gap-1">
              <span class="text-gray-500">{{ f }}</span>
              <button @click="removeFile(i)" class="btn btn-ghost btn-xs">×</button>
            </div>
          </div>
          <input v-model="fileInput" @keydown.enter="addFile" :placeholder="t('home.filePlaceholder')" class="input input-bordered input-xs w-full mt-2" />
        </div>
        <div class="flex flex-col gap-1">
          <button @click="moveTop" class="btn btn-ghost btn-xs">↑</button>
          <button @click="moveBottom" class="btn btn-ghost btn-xs">↓</button>
          <button @click="deleteItem" class="btn btn-ghost btn-xs">×</button>
        </div>
      </div>
    </div>
  </div>
</template>
