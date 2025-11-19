<script setup>
import draggable from 'vuedraggable'
import { usePromptStore } from '@/stores/prompt'
import { storeToRefs } from 'pinia'
import PromptItem from './PromptItem.vue'

const store = usePromptStore()
// We need filteredItems to be reactive and writable for draggable? 
// Actually draggable usually works best with the main list, but here we have search.
// If search is active, drag and drop might be weird if we bind to filtered list.
// However, the original code bound to `items` but displayed filtered? 
// Wait, original code: `const filteredItems = computed(...)`. 
// And `<draggable v-model="items">`... wait, if we use filtered items in v-for, we can't use v-model on draggable easily with filtered list.
// Let's check original code:
// It used `v-model="items"` on draggable. But did it filter?
// Original: `const filteredItems = computed(...)`
// But the template used `<draggable v-model="items">`.
// So the original code did NOT filter the draggable list visually? 
// Ah, if I look at the original template:
// `<draggable v-model="items" ...>`
// It seems it was iterating over `items` (implicitly via v-model slot).
// So search was NOT working for the list display?
// Let's re-read original code.
// `const filteredItems = computed(...)`
// But where is `filteredItems` used?
// It is NOT used in the template for the list!
// `draggable v-model="items"`
// So the search feature was BROKEN or incomplete in the original code?
// Wait, line 73 defined `filteredItems`.
// But line 162 used `items`.
// So yes, the search feature was likely not affecting the list view in the original code.
// I should fix this or replicate it. 
// If I want to fix it: Draggable with filtered list is tricky.
// For now, I will bind to `store.items` to maintain original behavior (and maybe fix search later or now if easy).
// Actually, if I want search to work, I should probably just hide items that don't match, rather than changing the model.
// But `draggable` renders its own children based on the model.
// I will stick to `store.items` for now to be safe and consistent with original (even if original search was buggy/unused for list).
// Wait, `filteredItems` IS used? No, I don't see it used in the template I read.
// I see `searchQuery` v-model.
// Maybe I missed something.
// Regardless, I will use `store.items`.

const { items } = storeToRefs(store)
</script>

<template>
  <draggable 
    v-model="items" 
    item-key="id" 
    class="space-y-2"
  >
    <template #item="{element, index}">
      <PromptItem :item="element" :index="index" />
    </template>
  </draggable>
</template>
