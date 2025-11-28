import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'

export default Blits.Component('Header', {
  props: ['count', 'total'],
  template: `
    <Element :w="$w" h="96">
      <Rect :w="$w" h="96" :color="$bgGradient"/>
      <Element x="40" y="28">
        <Text size="40" :color="$textColor" content="Ocean Shop" />
      </Element>
      <Element mount="{x: 1}" :x="$wMinus40" y="20" w="420" h="56" :effects="$radiusLg">
        <Rect w="420" h="56" :color="$surfaceColor" :shadow="$shadowSm" />
        <Element x="20" y="14">
          <Text size="28" :color="$mutedText" content="Cart:" />
        </Element>
        <Element x="110" y="14">
          <Text size="28" :color="$textColor" :content="$itemsLabel"/>
        </Element>
        <Element mount="{x: 1}" x="400" y="14">
          <Text size="28" :color="$primaryColor" :content="$totalLabel"/>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      w: 1920,
      wMinus40: 1880,
      textColor: Theme.colors.text,
      mutedText: Theme.colors.mutedText,
      surfaceColor: Theme.colors.surface,
      primaryColor: Theme.colors.primary,
      bgGradient: { top: Theme.colors.gradientTop, bottom: Theme.colors.gradientBottom },
      shadowSm: { blur: Theme.elevation.sm, color: Theme.colors.shadow, spread: 0 },
      radiusLg: [this.$shader('radius', { radius: Theme.radii.lg })],
      count: 0,
      total: 0,
    }
  },
  computed: {
    itemsLabel() {
      return ` ${this.count} items`
    },
    totalLabel() {
      return `$${this.total.toFixed(2)}`
    },
  },
})
