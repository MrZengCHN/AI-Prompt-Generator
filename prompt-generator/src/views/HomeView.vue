<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const { t, locale } = useI18n()

const newItem = ref({ text: '', priority: 'high', tags: '' })
const items = ref([])
const searchQuery = ref('')
const fileInput = ref({})
const encoding = ref('UTF-8')
const customPrompt = ref('')
const selectedMcps = ref([])
const customMcp = ref('')
const toggles = ref({ encoding: true, customPrompt: true, mcp: true })

onMounted(() => {
  const saved = localStorage.getItem('items')
  if (saved) items.value = JSON.parse(saved)
  const savedEncoding = localStorage.getItem('encoding')
  if (savedEncoding) encoding.value = savedEncoding
  const savedPrompt = localStorage.getItem('customPrompt')
  if (savedPrompt) customPrompt.value = savedPrompt
  const savedMcps = localStorage.getItem('selectedMcps')
  if (savedMcps) selectedMcps.value = JSON.parse(savedMcps)
  const savedToggles = localStorage.getItem('toggles')
  if (savedToggles) toggles.value = JSON.parse(savedToggles)
})

watch(encoding, (val) => {
  localStorage.setItem('encoding', val)
})

watch(customPrompt, (val) => {
  localStorage.setItem('customPrompt', val)
})

watch(selectedMcps, (val) => {
  localStorage.setItem('selectedMcps', JSON.stringify(val))
}, { deep: true })

watch(toggles, (val) => {
  localStorage.setItem('toggles', JSON.stringify(val))
}, { deep: true })

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
  newItem.value = { text: '', priority: 'high', tags: '' }
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
  const stats = completed > 0 ? t('home.mdStats', { total: items.value.length, completed }) : t('home.mdStatsNoCompleted', { total: items.value.length })
  let md = `# ${t('home.mdHeader')}\n\n`
  if (toggles.value.encoding) {
    md += `${locale.value === 'en' ? 'Encoding Format Used in Project' : locale.value === 'zh-TW' ? '項目所使用的編碼格式' : '项目所使用的编码格式'}：${encoding.value}\n\n`
  }
  if (toggles.value.customPrompt) {
    const instruction = customPrompt.value || t('home.mdInstruction')
    md += `${instruction}\n\n`
  }
  md += `${stats}\n\n`
  items.value.forEach(item => {
    const check = item.completed ? 'x' : ' '
    const tags = item.tags.length ? ' #' + item.tags.join(' #') : ''
    const priority = t(`home.priority.${item.priority}`)
    md += `- [${check}] ${item.text}${tags} [${priority}${locale.value.startsWith('zh') ? '优先级' : ' Priority'}]\n`
    item.files.forEach(f => md += `  - ${locale.value === 'en' ? 'Related file' : '涉及文件'}: ${f}\n`)
    md += '\n'
  })
  if (toggles.value.mcp && selectedMcps.value.length > 0) {
    md += '------\n## MCP Tools\n\n'
    selectedMcps.value.forEach(mcp => md += `use ${mcp}\n`)
  }
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
const addCustomMcp = () => {
  if (customMcp.value.trim() && !selectedMcps.value.includes(customMcp.value.trim())) {
    selectedMcps.value.push(customMcp.value.trim())
    customMcp.value = ''
  }
}
const removeMcp = (mcp) => {
  const idx = selectedMcps.value.indexOf(mcp)
  if (idx > -1) selectedMcps.value.splice(idx, 1)
}
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
          <input v-model="newItem.tags" @keydown.enter="addItem" :placeholder="t('home.tagsPlaceholder')" class="input input-bordered flex-1" />
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
          <div class="card bg-base-100 shadow cursor-move transition-all duration-100 hover:shadow-xl" @click="item.editing = false">
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
          <fieldset class="border border-base-300 rounded-lg p-3 mb-2">
            <legend class="text-sm font-medium px-2">{{ t('home.toggles') }}</legend>
            <div class="grid grid-cols-3 gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="toggles.encoding" class="toggle toggle-sm" />
                <span class="text-sm">{{ t('home.encoding') }}</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="toggles.customPrompt" class="toggle toggle-sm" />
                <span class="text-sm">{{ t('home.customPrompt') }}</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="toggles.mcp" class="toggle toggle-sm" />
                <span class="text-sm">{{ t('home.useMcp') }}</span>
              </label>
            </div>
          </fieldset>
          <fieldset v-if="toggles.encoding" class="border border-base-300 rounded-lg p-3 mb-2">
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
          <fieldset v-if="toggles.customPrompt" class="border border-base-300 rounded-lg p-3 mb-2">
            <legend class="text-sm font-medium px-2">{{ t('home.customPrompt') }}</legend>
            <textarea v-model="customPrompt" :placeholder="t('home.mdInstruction')" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
          </fieldset>
          <fieldset v-if="toggles.mcp" class="border border-base-300 rounded-lg p-3 mb-2">
            <legend class="text-sm font-medium px-2">{{ t('home.useMcp') }}</legend>
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="context7" v-model="selectedMcps" class="checkbox checkbox-sm" />
                <span class="text-sm">context7</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="Chrome DevTools" v-model="selectedMcps" class="checkbox checkbox-sm" />
                <span class="text-sm">Chrome DevTools</span>
              </label>
              <div class="flex gap-2 mt-2">
                <input v-model="customMcp" @keydown.enter="addCustomMcp" placeholder="Add custom MCP..." class="input input-bordered input-xs flex-1" />
                <button @click="addCustomMcp" class="btn btn-ghost btn-xs">+</button>
              </div>
              <div v-if="selectedMcps.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span v-for="mcp in selectedMcps" :key="mcp" class="badge badge-sm gap-1">
                  {{ mcp }}
                  <button @click="removeMcp(mcp)" class="btn btn-ghost btn-xs p-0 min-h-0 h-auto">×</button>
                </span>
              </div>
            </div>
          </fieldset>
          <pre class="whitespace-pre-wrap text-sm bg-base-200 p-4 rounded">{{ markdown }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>