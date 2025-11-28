import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'
import { cartStore } from '../store/cart.js'

export default Blits.Component('ProductCard', {
  props: ['product'],
  template: `
    <Element :w="$cardW" :h="$cardH" :effects="$radiusLg" :alpha.transition="$alphaTransition">
      <Rect :w="$cardW" :h="$cardH" :color="$surfaceColor" :shadow="$shadowMd" />
      <Element x="16" y="16" :effects="$radiusMd">
        <Rect :w="$innerW" h="180" :color="$bgGradient"/>
        <Element :x="$innerCenterX" y="16" mount="{x:0.5}">
          <Image :src="$product.image" w="180" h="140" />
        </Element>
        <Element x="12" y="136" :effects="$pillRadius">
          <Rect w="120" h="32" :color="$primaryColor"/>
          <Element x="12" y="4"><Text size="22" color="#fff" :content="$product.tag"/></Element>
        </Element>
      </Element>

      <Element x="20" y="212">
        <Text size="28" :color="$textColor" :content="$product.name" />
      </Element>
      <Element x="20" y="252" w="340">
        <Text size="22" :color="$mutedText" :content="$product.description" lineheight="28" maxwidth="340" />
      </Element>
      <Element x="20" y="324">
        <Text size="26" :color="$primaryColor" :content="$priceLabel" />
      </Element>

      <!-- Controls -->
      <Element mount="{x:1}" :x="$cardWMinus20" y="316" w="150" h="44" :effects="$radiusMd">
        <Rect w="150" h="44" :color="$backgroundColor" />
        <Element x="8" y="6" :effects="$radiusSm">
          <Rect w="32" h="32" :color="$errorColor" />
          <Text x="9" y="5" size="24" color="#fff" content="-" @enter="$decrement" />
        </Element>
        <Element x="60" y="6">
          <Text size="24" :color="$textColor" :content="$qtyLabel" />
        </Element>
        <Element x="100" y="6" :effects="$radiusSm">
          <Rect w="32" h="32" :color="$secondaryColor" />
          <Text x="9" y="5" size="24" color="#fff" content="+" @enter="$increment" />
        </Element>
      </Element>

      <Element mount="{x:1}" :x="$cardWMinus20" y="372" :effects="$radiusMd" @enter="$addToCart">
        <Rect w="150" h="44" :color="$primaryColor" />
        <Text x="16" y="8" size="24" color="#fff" content="Add to Cart" />
      </Element>
    </Element>
  `,
  state() {
    return {
      cardW: 380,
      cardH: 430,
      qty: 1,
      alpha: 0.98,

      // derived UI values
      innerW: 348, // cardW - 32
      cardWMinus20: 360,

      // theme bindings
      surfaceColor: Theme.colors.surface,
      backgroundColor: Theme.colors.background,
      textColor: Theme.colors.text,
      mutedText: Theme.colors.mutedText,
      primaryColor: Theme.colors.primary,
      secondaryColor: Theme.colors.secondary,
      errorColor: Theme.colors.error,
      bgGradient: { top: Theme.colors.gradientTop, bottom: Theme.colors.gradientBottom },
      shadowMd: { blur: Theme.elevation.md, color: Theme.colors.shadow, spread: 0 },
      radiusLg: [this.$shader('radius', { radius: Theme.radii.lg })],
      radiusMd: [this.$shader('radius', { radius: Theme.radii.md })],
      radiusSm: [this.$shader('radius', { radius: Theme.radii.sm })],
      pillRadius: [this.$shader('radius', { radius: 999 })],
      alphaTransition: { value: 0.98, duration: 250 },
    }
  },
  computed: {
    priceLabel() {
      return `$${this.product?.price?.toFixed ? this.product.price.toFixed(2) : Number(this.product?.price || 0).toFixed(2)}`
    },
    qtyLabel() {
      return `${this.qty}`
    },
    innerCenterX() {
      return (this.cardW - 32) / 2
    },
  },
  methods: {
    $increment() {
      const max = this.product?.stock ?? 99
      if (this.qty < max) this.qty += 1
    },
    $decrement() {
      if (this.qty > 1) this.qty -= 1
    },
    $addToCart() {
      if (!this.product) return
      cartStore.add(this.product, this.qty)
      this.alpha = 0.75
      this.$setTimeout(() => (this.alpha = 0.98), 180)
    },
  },
})
