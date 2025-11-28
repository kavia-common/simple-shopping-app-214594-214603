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
        <Element :x="$innerCenterX" y="16" :mount="$mountCenterX">
          <Image :src="$productImage" w="180" h="140" />
        </Element>
        <Element x="12" y="136" :effects="$pillRadius">
          <Rect w="120" h="32" :color="$primaryColor"/>
          <Element x="12" y="4"><Text size="22" color="#fff" :content="$productTag"/></Element>
        </Element>
      </Element>

      <Element x="20" y="212">
        <Text size="28" :color="$textColor" :content="$productName" />
      </Element>
      <Element x="20" y="252" w="340">
        <Text size="22" :color="$mutedText" :content="$productDescription" lineheight="28" maxwidth="340" />
      </Element>
      <Element x="20" y="324">
        <Text size="26" :color="$primaryColor" :content="$priceLabel" />
      </Element>

      <!-- Controls -->
      <Element :mount="$mountRight" :x="$cardWMinus20" y="316" w="150" h="44" :effects="$radiusMd">
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

      <Element :mount="$mountRight" :x="$cardWMinus20" y="372" :effects="$radiusMd" @enter="$addToCart">
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

      // effects to be initialized in ready()
      radiusLg: null,
      radiusMd: null,
      radiusSm: null,
      pillRadius: null,
      alphaTransition: { value: 0.98, duration: 250 },

      // mount strings
      mountRight: 'x:1',
      mountCenterX: 'x:0.5',
    }
  },
  hooks: {
    ready() {
      this.radiusLg = [this.$shader('radius', { radius: Theme.radii.lg })]
      this.radiusMd = [this.$shader('radius', { radius: Theme.radii.md })]
      this.radiusSm = [this.$shader('radius', { radius: Theme.radii.sm })]
      this.pillRadius = [this.$shader('radius', { radius: 999 })]
    },
  },
  computed: {
    priceLabel() {
      const p = this.product ? this.product.price : null
      const val = p != null ? Number(p) : 0
      return `$${val.toFixed(2)}`
    },
    qtyLabel() {
      return `${this.qty}`
    },
    innerCenterX() {
      return (this.cardW - 32) / 2
    },
    productName() {
      return this.product && this.product.name ? this.product.name : ''
    },
    productDescription() {
      return this.product && this.product.description ? this.product.description : ''
    },
    productTag() {
      return this.product && this.product.tag ? this.product.tag : ''
    },
    productImage() {
      return this.product && this.product.image ? this.product.image : ''
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    $increment() {
      /** Increment selected quantity up to product stock or 99. */
      const max = this.product?.stock ?? 99
      if (this.qty < max) this.qty += 1
    },
    // PUBLIC_INTERFACE
    $decrement() {
      /** Decrement selected quantity, minimum 1. */
      if (this.qty > 1) this.qty -= 1
    },
    // PUBLIC_INTERFACE
    $addToCart() {
      /** Add current product and quantity to cart and trigger a brief visual alpha feedback. */
      if (!this.product) return
      cartStore.add(this.product, this.qty)
      this.alpha = 0.75
      this.$setTimeout(() => (this.alpha = 0.98), 180)
    },
  },
})
