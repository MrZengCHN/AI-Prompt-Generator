import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export const usePromptStore = defineStore('prompt', () => {
    const { t, locale } = useI18n()

    // State
    const items = ref([])
    const encoding = ref('UTF-8')
    const customPrompt = ref('')
    const selectedMcps = ref([])
    const toggles = ref({ encoding: true, customPrompt: true, mcp: true })
    const searchQuery = ref('')

    // Actions
    const initStore = () => {
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
    }

    const addItem = (itemData) => {
        items.value.push({
            id: Date.now(),
            text: itemData.text,
            priority: itemData.priority,
            tags: itemData.tags.split(',').map(t => t.trim()).filter(Boolean),
            files: [],
            completed: false,
            editing: false
        })
    }

    const deleteItem = (index) => {
        items.value.splice(index, 1)
    }

    const updateItem = (index, data) => {
        // Logic handled by v-model binding in components usually, 
        // but explicit update actions can be added if needed.
    }

    const addFileToItem = (itemId, filePath) => {
        const item = items.value.find(i => i.id === itemId)
        if (item && filePath?.trim()) {
            item.files.push(filePath.trim())
        }
    }

    const removeFileFromItem = (itemId, fileIndex) => {
        const item = items.value.find(i => i.id === itemId)
        if (item) {
            item.files.splice(fileIndex, 1)
        }
    }

    const clearCompleted = () => {
        items.value = items.value.filter(i => !i.completed)
    }

    const clearAll = () => {
        items.value = []
    }

    const moveItem = (fromIndex, toIndex) => {
        // vuedraggable handles this directly on the array, 
        // but if we need manual move:
        const item = items.value.splice(fromIndex, 1)[0]
        items.value.splice(toIndex, 0, item)
    }

    const moveTop = (index) => {
        items.value.unshift(items.value.splice(index, 1)[0])
    }

    const moveBottom = (index) => {
        items.value.push(items.value.splice(index, 1)[0])
    }

    const addMcp = (mcp) => {
        if (mcp.trim() && !selectedMcps.value.includes(mcp.trim())) {
            selectedMcps.value.push(mcp.trim())
        }
    }

    const removeMcp = (mcp) => {
        const idx = selectedMcps.value.indexOf(mcp)
        if (idx > -1) selectedMcps.value.splice(idx, 1)
    }

    // Getters
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

    // Persistence
    watch(encoding, (val) => localStorage.setItem('encoding', val))
    watch(customPrompt, (val) => localStorage.setItem('customPrompt', val))
    watch(selectedMcps, (val) => localStorage.setItem('selectedMcps', JSON.stringify(val)), { deep: true })
    watch(toggles, (val) => localStorage.setItem('toggles', JSON.stringify(val)), { deep: true })
    watch(items, (val) => localStorage.setItem('items', JSON.stringify(val)), { deep: true })

    return {
        items,
        encoding,
        customPrompt,
        selectedMcps,
        toggles,
        searchQuery,
        filteredItems,
        markdown,
        initStore,
        addItem,
        deleteItem,
        addFileToItem,
        removeFileFromItem,
        clearCompleted,
        clearAll,
        moveTop,
        moveBottom,
        addMcp,
        removeMcp
    }
})
