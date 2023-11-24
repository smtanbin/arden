const lightenHexColor = (hexColor: string, percentage: number = 50): string => {
  // Remove the hash if it exists
  const hex = hexColor.replace(/^#/, "")

  // Parse the hex string to an integer
  const colorValue = parseInt(hex, 16)
  // Calculate the new color value by adding the difference between the original value and 0xFFFFFF (white) multiplied by the percentage
  const newColorValue =
    colorValue + (0xffffff - colorValue) * (percentage / 100)

  // Ensure the new color value is within the valid range [0, 0xFFFFFF]
  const finalColorValue = Math.min(newColorValue, 0xffffff)

  // Convert the new color value back to a hex string
  const lightenedHex = finalColorValue.toString(16).padStart(6, "0")

  // Add the hash back to the hex string
  return `#${lightenedHex}`
}

const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000" : "#fff"
}

export { lightenHexColor,  getContrastColor }
