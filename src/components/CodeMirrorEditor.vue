<template>
  <div ref="container" class="cm-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { EditorView, placeholder as cmPlaceholder, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { xml } from '@codemirror/lang-xml'
import { indentWithTab } from '@codemirror/commands'

const props = defineProps({
  modelValue: { type: String, default: '' },
  readOnly: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const container = ref(null)
const view = shallowRef(null)
let ignoreNextUpdate = false

onMounted(() => {
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      xml(),
      keymap.of([indentWithTab]),
      props.placeholder ? cmPlaceholder(props.placeholder) : [],
      EditorState.readOnly.of(props.readOnly),
      EditorView.theme({
        '&': { height: '100%' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace", fontSize: '13px' },
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          ignoreNextUpdate = true
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
    ],
  })

  view.value = new EditorView({
    state,
    parent: container.value,
  })
})

watch(
  () => props.modelValue,
  (val) => {
    if (ignoreNextUpdate) {
      ignoreNextUpdate = false
      return
    }
    const v = view.value
    if (v && v.state.doc.toString() !== val) {
      v.dispatch({
        changes: { from: 0, to: v.state.doc.length, insert: val },
      })
    }
  }
)

onUnmounted(() => {
  view.value?.destroy()
})
</script>

<style scoped>
.cm-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.cm-container :deep(.cm-editor) {
  height: 100%;
}
.cm-container :deep(.cm-focused) {
  outline: none;
}
</style>
