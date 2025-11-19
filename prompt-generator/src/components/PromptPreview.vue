<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = usePromptStore()
const { encoding, customPrompt, selectedMcps, toggles, markdown } = storeToRefs(store)

const customMcp = ref('')

const addCustomMcp = () => {
  if (customMcp.value.trim()) {
    store.addMcp(customMcp.value)
    customMcp.value = ''
  }
}

const removeMcp = (mcp) => {
  store.removeMcp(mcp)
}
</script>

<template>
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

      <pre class="whitespace-pre-wrap break-words text-sm bg-base-200 p-4 rounded">{{ markdown }}</pre>
    </div>
  </div>
</template>
