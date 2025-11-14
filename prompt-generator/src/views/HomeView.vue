<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const { t, locale } = useI18n()

const newItem = ref({ text: '', priority: 'medium', tags: '' })
const items = ref([])
const searchQuery = ref('')
const fileInput = ref({})
const encoding = ref('UTF-8')
const customPrompt = ref('')

onMounted(() => {
  const saved = localStorage.getItem('items')
  if (saved) items.value = JSON.parse(saved)
  const savedEncoding = localStorage.getItem('encoding')
  if (savedEncoding) encoding.value = savedEncoding
  const savedPrompt = localStorage.getItem('customPrompt')
  if (savedPrompt) customPrompt.value = savedPrompt
})

watch(encoding, (val) => {
  localStorage.setItem('encoding', val)
})

watch(customPrompt, (val) => {
  localStorage.setItem('customPrompt', val)
})

watch(items, (val) => {
  localStorage.setItem('items', JSON.stringify(val))
}, { deep: true })

const addItem = () => {
  if (!newItem.value.text.trim()) return
  items.value.push({
    id: Date.now(),
    text: newItem.value.text,
    priority: newItem.value.priority,
    tags: newItem.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    files: [],
    completed: false,
    editing: false
  })
  newItem.value = { text: '', priority: 'medium', tags: '' }
}

const addFile = (item) => {
  const file = fileInput.value[item.id]
  if (file?.trim()) {
    item.files.push(file)
    fileInput.value[item.id] = ''
  }
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(item =>
    item.text.toLowerCase().includes(q) ||
    item.tags.some(t => t.toLowerCase().includes(q)) ||
    item.files.some(f => f.toLowerCase().includes(q))
  )
})

const markdown = computed(() => {
  const completed = items.value.filter(i => i.completed).length
  const instruction = customPrompt.value || t('home.mdInstruction')
  let md = `# ${t('home.mdHeader')}\n\n${locale.value === 'en' ? 'Encoding Format Used in Project' : locale.value === 'zh-TW' ? '項目所使用的編碼格式' : '项目所使用的编码格式'}：${encoding.value}\n\n${instruction}\n\n${t('home.mdStats', { total: items.value.length, completed })}\n\n`
  items.value.forEach(item => {
    const check = item.completed ? 'x' : ' '
    const tags = item.tags.length ? ' #' + item.tags.join(' #') : ''
    const priority = t(`home.priority.${item.priority}`)
    md += `- [${check}] ${item.text}${tags} [${priority}${locale.value.startsWith('zh') ? '优先级' : ' Priority'}]\n`
    item.files.forEach(f => md += `  - ${locale.value === 'en' ? 'Related file' : '涉及文件'}: ${f}\n`)
    md += '\n'
  })
  return md
})

const exportMd = () => {
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'requirements.md'
  a.click()
}

const copyMd = () => navigator.clipboard.writeText(markdown.value)
const clearCompleted = () => items.value = items.value.filter(i => !i.completed)
const clearAll = () => items.value = []
const moveTop = (idx) => items.value.unshift(items.value.splice(idx, 1)[0])
const moveBottom = (idx) => items.value.push(items.value.splice(idx, 1)[0])
const deleteItem = (idx) => items.value.splice(idx, 1)
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <div class="card bg-base-100 shadow mb-4 transition-all duration-100 hover:shadow-2xl">
      <div class="card-body">
        <textarea v-model="newItem.text" @keydown.ctrl.enter="addItem" @keydown.meta.enter="addItem" :placeholder="t('home.inputPlaceholder')" class="textarea textarea-bordered w-full" rows="3"></textarea>
        <div class="flex gap-2 mt-2">
          <select v-model="newItem.priority" class="select select-bordered">
            <option value="high">{{ t('home.priority.high') }}</option>
            <option value="medium">{{ t('home.priority.medium') }}</option>
            <option value="low">{{ t('home.priority.low') }}</option>
          </select>
          <input v-model="newItem.tags" :placeholder="t('home.tagsPlaceholder')" class="input input-bordered flex-1" />
          <button @click="addItem" class="btn btn-primary">{{ t('home.addButton') }}</button>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mb-4">
      <input v-model="searchQuery" :placeholder="t('home.searchPlaceholder')" class="input input-bordered flex-1" />
      <button @click="exportMd" class="btn btn-outline">{{ t('home.exportButton') }}</button>
      <button @click="copyMd" class="btn btn-outline">{{ t('home.copyButton') }}</button>
      <button @click="clearCompleted" class="btn btn-outline">{{ t('home.clearCompleted') }}</button>
      <button @click="clearAll" class="btn btn-outline btn-error">{{ t('home.clearAll') }}</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <draggable v-model="items" item-key="id" class="space-y-2">
        <template #item="{element: item, index: idx}">
          <div class="card bg-base-100 shadow cursor-move transition-all duration-100 hover:shadow-xl">
            <div class="card-body p-4">
              <div class="flex items-start gap-2">
                <input type="checkbox" v-model="item.completed" class="checkbox" />
                <div class="flex-1">
                  <div v-if="!item.editing" @dblclick="item.editing = true" class="cursor-pointer">
                    <span :class="{'line-through': item.completed}">{{ item.text }}</span>
                    <div class="flex gap-1 mt-1">
                      <span class="badge" :class="{'badge-error': item.priority === 'high', 'badge-warning': item.priority === 'medium', 'badge-info': item.priority === 'low'}">{{ t(`home.priority.${item.priority}`) }}</span>
                      <span v-for="tag in item.tags" :key="tag" class="badge badge-outline">{{ tag }}</span>
                    </div>
                  </div>
                  <textarea v-else v-model="item.text" @blur="item.editing = false" @keydown.enter.exact="item.editing = false" class="textarea textarea-bordered w-full" rows="2"></textarea>
                  <div v-if="item.files.length" class="text-xs mt-2 space-y-1">
                    <div v-for="(f, i) in item.files" :key="i" class="flex items-center gap-1">
                      <span class="text-gray-500">{{ f }}</span>
                      <button @click="item.files.splice(i, 1)" class="btn btn-ghost btn-xs">×</button>
                    </div>
                  </div>
                  <input v-model="fileInput[item.id]" @keydown.enter="addFile(item)" :placeholder="t('home.filePlaceholder')" class="input input-bordered input-xs w-full mt-2" />
                </div>
                <div class="flex flex-col gap-1">
                  <button @click="moveTop(idx)" class="btn btn-ghost btn-xs">↑</button>
                  <button @click="moveBottom(idx)" class="btn btn-ghost btn-xs">↓</button>
                  <button @click="deleteItem(idx)" class="btn btn-ghost btn-xs">×</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <div class="card bg-base-100 shadow-xl sticky top-4 transition-all duration-100 hover:shadow-2xl">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h3 class="card-title">{{ t('home.preview') }}</h3>
            <button @click="copyMd" class="btn btn-ghost btn-sm">{{ t('home.copyButton') }}</button>
          </div>
          <fieldset class="border border-base-300 rounded-lg p-3 mb-2">
            <legend class="text-sm font-medium px-2">{{ t('home.encoding') }}</legend>
            <input v-model="encoding" list="encodings" class="input input-bordered input-sm w-full" />
            <datalist id="encodings">
              <option value="UTF-8" />
              <option value="UTF-16" />
              <option value="UTF-32" />
              <option value="GBK" />
              <option value="GB2312" />
              <option value="Big5" />
              <option value="ISO-8859-1" />
              <option value="ASCII" />
            </datalist>
          </fieldset>
          <fieldset class="border border-base-300 rounded-lg p-3 mb-2">
            <legend class="text-sm font-medium px-2">{{ t('home.customPrompt') }}</legend>
            <textarea v-model="customPrompt" :placeholder="t('home.mdInstruction')" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
          </fieldset>
          <pre class="whitespace-pre-wrap text-sm bg-base-200 p-4 rounded">{{ markdown }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>