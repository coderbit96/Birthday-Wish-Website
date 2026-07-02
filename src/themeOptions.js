export const colorThemes = [
  { id: 'rose-sunset', label: 'Rose Sunset', accent: '#df526f', secondary: '#f29a7b', ink: '#4a2630', surface: '#fff2f3', gradient: 'linear-gradient(135deg, #df526f 0%, #f29a7b 100%)' },
  { id: 'violet-dream', label: 'Violet Dream', accent: '#7b5bd6', secondary: '#c471ed', ink: '#342653', surface: '#f5f0ff', gradient: 'linear-gradient(135deg, #6f58d9 0%, #c471ed 100%)' },
  { id: 'golden-hour', label: 'Golden Hour', accent: '#df8a32', secondary: '#f1c453', ink: '#4b321e', surface: '#fff7e8', gradient: 'linear-gradient(135deg, #df8a32 0%, #f1c453 100%)' },
  { id: 'ocean-mint', label: 'Ocean Mint', accent: '#268e7b', secondary: '#55c6bc', ink: '#1f413b', surface: '#edf9f6', gradient: 'linear-gradient(135deg, #268e7b 0%, #55c6bc 100%)' },
  { id: 'blue-skies', label: 'Blue Skies', accent: '#3977c7', secondary: '#64b5f6', ink: '#233c5d', surface: '#eef6ff', gradient: 'linear-gradient(135deg, #3977c7 0%, #64b5f6 100%)' },
  { id: 'berry-night', label: 'Berry Night', accent: '#ad3f75', secondary: '#7047c7', ink: '#40243d', surface: '#fbf0f8', gradient: 'linear-gradient(135deg, #ad3f75 0%, #7047c7 100%)' },
  { id: 'peach-glow', label: 'Peach Glow', accent: '#ef765f', secondary: '#f5b75c', ink: '#53312b', surface: '#fff3ed', gradient: 'linear-gradient(135deg, #ef765f 0%, #f5b75c 100%)' },
  { id: 'forest-gold', label: 'Forest Gold', accent: '#39765b', secondary: '#c29a49', ink: '#293d33', surface: '#f1f6ef', gradient: 'linear-gradient(135deg, #39765b 0%, #c29a49 100%)' },
  { id: 'midnight-aurora', label: 'Midnight Aurora', accent: '#315f78', secondary: '#7656a8', ink: '#243442', surface: '#eef1f6', gradient: 'linear-gradient(135deg, #315f78 0%, #7656a8 100%)' },
  { id: 'lavender-rose', label: 'Lavender Rose', accent: '#91618f', secondary: '#e78ba6', ink: '#432d42', surface: '#faf0f7', gradient: 'linear-gradient(135deg, #91618f 0%, #e78ba6 100%)' },
]

export function getColorTheme(value) {
  return colorThemes.find((theme) => theme.id === value || theme.accent.toLowerCase() === value?.toLowerCase()) || colorThemes[0]
}
