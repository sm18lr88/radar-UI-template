import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'

const size = 256

function crc32(data) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const chunk = Buffer.alloc(12 + data.length)
  chunk.writeUInt32BE(data.length, 0)
  typeBuffer.copy(chunk, 4)
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length)
  return chunk
}

function mix(start, end, amount) {
  return Math.round(start + (end - start) * amount)
}

function distanceToSegment(x, y, startX, startY, endX, endY) {
  const deltaX = endX - startX
  const deltaY = endY - startY
  const lengthSquared = deltaX * deltaX + deltaY * deltaY
  const amount = Math.max(0, Math.min(1, ((x - startX) * deltaX + (y - startY) * deltaY) / lengthSquared))
  return Math.hypot(x - (startX + amount * deltaX), y - (startY + amount * deltaY))
}

function insideRoundedSquare(x, y) {
  const radius = 60
  const nearestX = Math.max(radius, Math.min(size - radius - 1, x))
  const nearestY = Math.max(radius, Math.min(size - radius - 1, y))
  return Math.hypot(x - nearestX, y - nearestY) <= radius
}

export function writeDesktopIcon(packageRoot) {
  const rowLength = size * 4 + 1
  const pixels = Buffer.alloc(rowLength * size)

  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * rowLength
    pixels[rowOffset] = 0
    for (let x = 0; x < size; x += 1) {
      const offset = rowOffset + 1 + x * 4
      if (!insideRoundedSquare(x, y)) continue

      const gradient = Math.min(1, (x + y) / (size * 1.55))
      const distance = Math.hypot(x - 128, y - 128)
      const outerRing = Math.abs(distance - 78) <= 7
      const innerRing = Math.abs(distance - 40) <= 5
      const beam = distanceToSegment(x, y, 128, 128, 190, 76) <= 5
      const center = distance <= 12

      let red = mix(56, 15, gradient)
      let green = mix(189, 23, gradient)
      let blue = mix(248, 42, gradient)
      if (outerRing) [red, green, blue] = [186, 230, 253]
      if (innerRing) [red, green, blue] = [125, 211, 252]
      if (beam || center) [red, green, blue] = [248, 250, 252]

      pixels[offset] = red
      pixels[offset + 1] = green
      pixels[offset + 2] = blue
      pixels[offset + 3] = 255
    }
  }

  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 6
  const png = Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(pixels, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync(join(packageRoot, 'assets', 'icon.png'), png)
}
