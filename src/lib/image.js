// Загрузка изображения с уменьшением размера → dataURL (JPEG), чтобы не
// переполнять localStorage. Используется для скринов в Базе знаний.
export function fileToScaledDataURL(file, maxW = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type).startsWith('image/')) return reject(new Error('Это не изображение'))
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsDataURL(file)
  })
}

// Достать изображение из события вставки (Ctrl/Cmd+V)
export function imageFromPaste(e) {
  const items = e.clipboardData?.items || []
  for (const it of items) {
    if (it.type && it.type.startsWith('image/')) return it.getAsFile()
  }
  return null
}
