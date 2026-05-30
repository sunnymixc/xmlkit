<template>
  <div class="xml-editor">
    <div class="toolbar">
      <h1 class="toolbar-title">XML Kit</h1>
      <a-space>
        <a-button type="primary" @click="handleFormat">格式化</a-button>
        <a-button @click="handleMinify">压缩</a-button>
        <a-button @click="handleUnescape">反转义</a-button>
        <a-button @click="handleEscape">转义</a-button>
        <a-button danger @click="handleClear">清空</a-button>
      </a-space>
    </div>

    <div class="editor-body">
      <div class="panel">
        <div class="panel-header">
          <span>输入</span>
          <a-button size="small" @click="handlePaste">粘贴</a-button>
        </div>
        <CodeMirrorEditor
          v-model="input"
          placeholder="在此粘贴 XML 内容..."
        />
      </div>
      <div class="panel">
        <div class="panel-header">
          <span>输出</span>
          <a-button size="small" @click="handleCopy" :disabled="!output">复制</a-button>
        </div>
        <CodeMirrorEditor
          v-model="output"
          read-only
          placeholder="处理结果将显示在这里..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { formatXml, unescapeXml, escapeXml, minifyXml } from '../utils/xml'
import CodeMirrorEditor from './CodeMirrorEditor.vue'

const input = ref('')
const output = ref('')

function handleFormat() {
  if (!input.value.trim()) return message.warning('请先输入内容')
  try {
    output.value = formatXml(input.value)
    message.success('格式化完成')
  } catch (e) {
    message.error(e.message)
  }
}

function handleMinify() {
  if (!input.value.trim()) return message.warning('请先输入内容')
  output.value = minifyXml(input.value)
  message.success('压缩完成')
}

function handleUnescape() {
  if (!input.value.trim()) return message.warning('请先输入内容')
  output.value = unescapeXml(input.value)
  message.success('反转义完成')
}

function handleEscape() {
  if (!input.value.trim()) return message.warning('请先输入内容')
  output.value = escapeXml(input.value)
  message.success('转义完成')
}

function handleClear() {
  input.value = ''
  output.value = ''
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败')
  }
}

async function handlePaste() {
  try {
    input.value = await navigator.clipboard.readText()
    message.success('已粘贴')
  } catch {
    message.error('无法读取剪贴板')
  }
}
</script>

<style scoped>
.xml-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.toolbar-title {
  font-size: 20px;
  color: #1677ff;
  margin: 0;
  white-space: nowrap;
}

.editor-body {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
}

.panel:last-child {
  border-right: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  font-size: 13px;
  color: #666;
  flex-shrink: 0;
}
</style>
