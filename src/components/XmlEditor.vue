<template>
  <div class="xml-editor">
    <a-row :gutter="16" class="editor-row">
      <a-col :span="12">
        <div class="panel">
          <div class="panel-header">
            <span>输入</span>
            <a-button size="small" @click="handlePaste">粘贴</a-button>
          </div>
          <a-textarea
            v-model:value="input"
            :auto-size="{ minRows: 20, maxRows: 30 }"
            placeholder="在此粘贴 XML 内容..."
          />
        </div>
      </a-col>
      <a-col :span="12">
        <div class="panel">
          <div class="panel-header">
            <span>输出</span>
            <a-button size="small" @click="handleCopy" :disabled="!output">复制</a-button>
          </div>
          <a-textarea
            v-model:value="output"
            :auto-size="{ minRows: 20, maxRows: 30 }"
            readonly
            placeholder="处理结果将显示在这里..."
          />
        </div>
      </a-col>
    </a-row>

    <div class="actions">
      <a-space>
        <a-button type="primary" @click="handleFormat">格式化</a-button>
        <a-button @click="handleMinify">压缩</a-button>
        <a-button @click="handleUnescape">反转义</a-button>
        <a-button @click="handleEscape">转义</a-button>
        <a-button danger @click="handleClear">清空</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { formatXml, unescapeXml, escapeXml, minifyXml } from '../utils/xml'

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.editor-row {
  min-height: 480px;
}

.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #666;
}

.actions {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
