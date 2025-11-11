import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    nav: {
      title: 'Prompt Generator',
      home: '首页',
      about: '关于'
    },
    home: {
      inputPlaceholder: '输入需求描述（Ctrl/Cmd+Enter 快速添加）',
      tagsPlaceholder: '标签（逗号分隔）',
      addButton: '添加',
      searchPlaceholder: '搜索...',
      exportButton: '导出',
      copyButton: '复制',
      clearCompleted: '清除已完成',
      clearAll: '清除所有',
      preview: '预览',
      encoding: '文件编码',
      customPrompt: '自定义提示词',
      filePlaceholder: '涉及文件',
      priority: { high: '高', medium: '中', low: '低' },
      mdHeader: '需求清单',
      mdEncoding: '文件编码：UTF-8',
      mdInstruction: '完成下方的任务，完成后按照每个任务给我列出几条我可以改进的内容方案供我选择',
      mdStats: '共 {total} 条 ｜ 已完成 {completed}'
    },
    about: {
      title: '功能介绍',
      desc: '一个简洁高效的需求管理工具，帮助你整理和导出 AI 提示词需求清单。',
      features: '主要功能',
      f1: '需求管理：添加、编辑、删除、排序需求条目',
      f2: '优先级标记：高/中/低三级优先级',
      f3: '标签分类：使用标签组织需求',
      f4: '文件关联：为每个需求添加相关文件路径',
      f5: '拖拽排序：直接拖动卡片调整顺序',
      f6: '搜索过滤：按内容、标签、文件快速查找',
      f7: '自定义编码：支持多种文件编码格式',
      f8: '自定义提示词：个性化 Markdown 导出内容',
      f9: 'Markdown 导出：一键导出为标准格式文档',
      f10: '数据持久化：自动保存到本地存储',
      usage: '使用说明',
      u1: '在顶部输入框输入需求描述',
      u2: '选择优先级，添加标签（可选）',
      u3: '点击"添加"或按 Ctrl/Cmd+Enter',
      u4: '在需求卡片下方添加相关文件（可选）',
      u5: '拖拽卡片或使用按钮调整顺序',
      u6: '勾选完成状态，使用搜索过滤',
      u7: '导出或复制 Markdown 格式清单'
    }
  },
  'zh-TW': {
    nav: {
      title: 'Prompt Generator',
      home: '首頁',
      about: '關於'
    },
    home: {
      inputPlaceholder: '輸入需求描述（Ctrl/Cmd+Enter 快速添加）',
      tagsPlaceholder: '標籤（逗號分隔）',
      addButton: '添加',
      searchPlaceholder: '搜索...',
      exportButton: '導出',
      copyButton: '複製',
      clearCompleted: '清除已完成',
      clearAll: '清除所有',
      preview: '預覽',
      encoding: '文件編碼',
      customPrompt: '自定義提示詞',
      filePlaceholder: '涉及文件',
      priority: { high: '高', medium: '中', low: '低' },
      mdHeader: '需求清單',
      mdEncoding: '文件編碼：UTF-8',
      mdInstruction: '完成下方的任務，完成後按照每個任務給我列出幾條我可以改進的內容方案供我選擇',
      mdStats: '共 {total} 條 ｜ 已完成 {completed}'
    },
    about: {
      title: '功能介紹',
      desc: '一個簡潔高效的需求管理工具，幫助你整理和導出 AI 提示詞需求清單。',
      features: '主要功能',
      f1: '需求管理：添加、編輯、刪除、排序需求條目',
      f2: '優先級標記：高/中/低三級優先級',
      f3: '標籤分類：使用標籤組織需求',
      f4: '文件關聯：為每個需求添加相關文件路徑',
      f5: '拖拽排序：直接拖動卡片調整順序',
      f6: '搜索過濾：按內容、標籤、文件快速查找',
      f7: '自定義編碼：支持多種文件編碼格式',
      f8: '自定義提示詞：個性化 Markdown 導出內容',
      f9: 'Markdown 導出：一鍵導出為標準格式文檔',
      f10: '數據持久化：自動保存到本地存儲',
      usage: '使用說明',
      u1: '在頂部輸入框輸入需求描述',
      u2: '選擇優先級，添加標籤（可選）',
      u3: '點擊「添加」或按 Ctrl/Cmd+Enter',
      u4: '在需求卡片下方添加相關文件（可選）',
      u5: '拖拽卡片或使用按鈕調整順序',
      u6: '勾選完成狀態，使用搜索過濾',
      u7: '導出或複製 Markdown 格式清單'
    }
  },
  en: {
    nav: {
      title: 'Prompt Generator',
      home: 'Home',
      about: 'About'
    },
    home: {
      inputPlaceholder: 'Enter requirement description (Ctrl/Cmd+Enter to add)',
      tagsPlaceholder: 'Tags (comma separated)',
      addButton: 'Add',
      searchPlaceholder: 'Search...',
      exportButton: 'Export',
      copyButton: 'Copy',
      clearCompleted: 'Clear Completed',
      clearAll: 'Clear All',
      preview: 'Preview',
      encoding: 'File Encoding',
      customPrompt: 'Custom Prompt',
      filePlaceholder: 'Related files',
      priority: { high: 'High', medium: 'Medium', low: 'Low' },
      mdHeader: 'Requirements Checklist',
      mdEncoding: 'File Encoding: UTF-8',
      mdInstruction: 'Complete the tasks below, then provide several improvement suggestions for each task',
      mdStats: 'Total {total} | Completed {completed}'
    },
    about: {
      title: 'Features',
      desc: 'A simple and efficient requirements management tool to help you organize and export AI prompt requirement checklists.',
      features: 'Key Features',
      f1: 'Requirements Management: Add, edit, delete, and sort requirement items',
      f2: 'Priority Marking: High/Medium/Low priority levels',
      f3: 'Tag Classification: Organize requirements with tags',
      f4: 'File Association: Add related file paths to each requirement',
      f5: 'Drag & Drop Sorting: Directly drag cards to adjust order',
      f6: 'Search & Filter: Quickly find by content, tags, or files',
      f7: 'Custom Encoding: Support multiple file encoding formats',
      f8: 'Custom Prompt: Personalize Markdown export content',
      f9: 'Markdown Export: Export to standard format document with one click',
      f10: 'Data Persistence: Automatically save to local storage',
      usage: 'Usage Guide',
      u1: 'Enter requirement description in the top input box',
      u2: 'Select priority, add tags (optional)',
      u3: 'Click "Add" or press Ctrl/Cmd+Enter',
      u4: 'Add related files below requirement card (optional)',
      u5: 'Drag cards or use buttons to adjust order',
      u6: 'Check completion status, use search to filter',
      u7: 'Export or copy Markdown format checklist'
    }
  }
}

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
})
