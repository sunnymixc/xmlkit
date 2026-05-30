<script setup>
import XmlEditor from './components/XmlEditor.vue'
</script>

<template>
  <div class="app">
    <XmlEditor />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f5f5;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
