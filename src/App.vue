<script setup>
import XmlEditor from './components/XmlEditor.vue'
</script>

<template>
  <div class="app">
    <div class="app-header">
      <h1>XML Kit</h1>
      <span class="subtitle">XML 格式化处理工具</span>
    </div>
    <XmlEditor />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.app-header {
  text-align: center;
  padding: 20px 0 4px;
}

.app-header h1 {
  font-size: 24px;
  color: #1677ff;
  margin: 0;
}

.app-header .subtitle {
  color: #999;
  font-size: 13px;
}
</style>
