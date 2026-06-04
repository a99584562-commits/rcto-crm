import { saveAs } from 'file-saver'
import { renderToBlob, sampleBlob } from './docxBuild.js'

// Чистая логика — в docxBuild.js (тестируется headless).
// Здесь только обёртки скачивания (file-saver требует браузер).
export { buildSampleTemplate, detectTags, buildData } from './docxBuild.js'

export function renderDocx(template, data, fileName) {
  const blob = renderToBlob(template, data)
  saveAs(blob, fileName || 'document.docx')
  return blob
}

export function downloadSampleTemplate() {
  saveAs(sampleBlob(), 'rcto-shablon-primer.docx')
}
