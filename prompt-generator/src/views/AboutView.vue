<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl mb-4">{{ t('about.title') }}</h2>
        <p class="text-lg mb-6">{{ t('about.desc') }}</p>

        <h3 class="text-2xl font-bold mb-3">{{ t('about.features') }}</h3>
        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f1') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f2') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f3') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f4') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f5') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f6') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f7') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f8') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f9') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary">✓</span>
            <span>{{ t('about.f10') }}</span>
          </li>
        </ul>

        <h3 class="text-2xl font-bold mb-3">{{ t('about.usage') }}</h3>
        <ol class="list-decimal list-inside space-y-2">
          <li>{{ t('about.u1') }}</li>
          <li>{{ t('about.u2') }}</li>
          <li>{{ t('about.u3') }}</li>
          <li>{{ t('about.u4') }}</li>
          <li>{{ t('about.u5') }}</li>
          <li>{{ t('about.u6') }}</li>
          <li>{{ t('about.u7') }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>
