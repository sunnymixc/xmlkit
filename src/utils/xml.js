/**
 * XML 格式化，使用 DOM 解析后递归序列化
 */
export function formatXml(xml, indent = 2) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    throw new Error('XML 解析失败：' + errorNode.textContent.trim().slice(0, 200))
  }
  return serializeNode(doc.documentElement, 0, indent)
}

function serializeNode(node, level, indent) {
  const pad = ' '.repeat(level * indent)
  const lines = []

  if (node.nodeType === Node.DOCUMENT_NODE) {
    for (const child of node.childNodes) {
      lines.push(serializeNode(child, level, indent))
    }
    return lines.filter(Boolean).join('\n')
  }

  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    return `${pad}<?${node.target} ${node.data}?>`
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim()
    return text || null
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!-- ${node.textContent} -->`
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName
    const attrs = Array.from(node.attributes)
      .map(a => `${a.name}="${escapeAttr(a.value)}"`)
      .join(' ')

    const attrStr = attrs ? ' ' + attrs : ''
    const children = Array.from(node.childNodes).filter(c => {
      if (c.nodeType === Node.TEXT_NODE) return c.textContent.trim() !== ''
      return true
    })

    if (children.length === 0) {
      return `${pad}<${tag}${attrStr} />`
    }

    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      const text = children[0].textContent.trim()
      return `${pad}<${tag}${attrStr}>${escapeText(text)}</${tag}>`
    }

    lines.push(`${pad}<${tag}${attrStr}>`)
    for (const child of children) {
      const result = serializeNode(child, level + 1, indent)
      if (result !== null) lines.push(result)
    }
    lines.push(`${pad}</${tag}>`)
    return lines.join('\n')
  }

  return null
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeText(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * XML 转义
 */
export function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * XML 反转义
 */
export function unescapeXml(str) {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
}

/**
 * 压缩 XML：去除多余空白
 */
export function minifyXml(xml) {
  return xml
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
}
