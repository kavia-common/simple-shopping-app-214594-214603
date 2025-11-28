import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'
import { cartStore } from '../store/cart.js'

export default Blits.Component('CartPanel', {
  props: ['open'],
  template: `
    <Element :w="$panelW" :h="$panelH" :x.transition="$slideTransitionValue">
      <Rect :w="$panelW" :h="$panelH" :color="$surfaceColor" :shadow="$shadowLgRef" />
      <Element x="20" y="16">
        <Text size="30" :color="$textColor" content="Your Cart" />
      </Element>

      <Element x="20" y="64" :h="$listH" :w="$listW">
        <Element :for="(item, index) in $entries" :key="$item.id" :y="$rowY(index)" :effects="$radiusMdRef">
          <Rect :w="$rowW" h="70" :color="$backgroundColor" />
          <Image :src="$item.image" x="10" y="10" w="50" h="50" />
          <Element x="70" y="12"><Text size="24" :color="$textColor" :content="$item.name"/></Element>
          <Element x="70" y="40"><Text size="20" :color="$mutedText" :content="$formatPrice($item.price)"/></Element>

          <Element mount="$mountRight" :x="$qtyLeftX" y="18" :effects="$radiusSmRef">
            <Rect w="32" h="32" :color="$errorColor" />
            <Text x="9" y="5" size="24" color="#fff" content="-" @enter="$dec($item)"/>
          </Element>
          <Element mount="$mountRight" :x="$qtyCenterX" y="22">
            <Text size="24" :color="$textColor" :content="$item.quantityString"/>
          </Element>
          <Element mount="$mountRight" :x="$qtyRightX" y="18" :effects="$radiusSmRef">
            <Rect w="32" h="32" :color="$secondaryColor" />
            <Text x="9" y="5" size="24" color="#fff" content="+" @enter="$inc($item)"/>
          </Element>

          <Element mount="$mountRight" :x="$removeX" y="18" :effects="$radiusSmRef" @enter="$remove($item)">
            <Rect w="32" h="32" :color="$errorColor" />
            <Text x="6" y="5" size="22" color="#fff" content="x"/>
          </Element>

          <Element mount="$mountRight" :x="$lineTotalX" y="48">
            <Text size="20" :color="$primaryColor" :content="$formatTotal($item.price, $item.quantity)"/>
          </Element>
        </Element>
      </Element>

      <Element :y="$footerY" x="20" :effects="$radiusMdRef">
        <Rect :w="$footerW" h="56" :color="$backgroundColor" />
        <Element x="16" y="14" @enter="$clear">
          <Rect w="140" h="28" :color="$errorColor" :effects="$radiusSmRef"/>
          <Text x="16" y="2" size="22" color="#fff" content="Clear Cart"/>
        </Element>
        <Element mount="$mountRight" :x="$totalLabelX" y="14">
          <Text size="24" :color="$mutedText" content="Total:"/>
        </Element>
        <Element mount="$mountRight" :x="$totalValueX" y="14">
          <Text size="26" :color="$primaryColor" :content="$formattedTotal"/>
        </Element>
      </Element>

      <Element :y="$checkoutY" mount="$mountRight" :x="$checkoutX" :effects="$radiusMdRef" @enter="$checkout">
        <Rect w="180" h="48" :color="$primaryColor" />
        <Text x="26" y="10" size="24" color="#fff" content="Checkout"/>
      </Element>

      <Element v-if="$showConfirm" :w="$panelW" :h="$panelH" :color="$overlayColor" :alpha.transition="$confirmTransitionValue">
        <Element :x="$centerX" :y="$centerY" mount="$mountCenter" :effects="$radiusLgRef">
          <Rect w="520" h="220" :color="$surfaceColor" :shadow="$shadowLgRef" />
          <Text x="36" y="36" size="28" :color="$textColor" content="Order Confirmed!" />
          <Text x="36" y="80" size="22" :color="$mutedText" content="Thank you for your purchase. A confirmation email would be sent in a real app." />
          <Element x="36" y="140" :effects="$radiusMdRef" @enter="$closeConfirm">
            <Rect w="140" h="44" :color="$secondaryColor" />
            <Text x="26" y="10" size="24" color="#fff" content="Close" />
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    const panelW = 560
    const panelH = 860
    return {
      panelW,
      panelH,
      x: 1920,
      entries: [],
      total: 0,
      showConfirm: false,
      confirmAlpha: 0,

      // theme bindings
      surfaceColor: Theme.colors.surface,
      backgroundColor: Theme.colors.background,
      textColor: Theme.colors.text,
      mutedText: Theme.colors.mutedText,
      primaryColor: Theme.colors.primary,
      secondaryColor: Theme.colors.secondary,
      errorColor: Theme.colors.error,
      overlayColor: Theme.colors.overlay,

      // precomputed shader/effects/shadow references (avoid inline literals in template)
      shadowLgRef: { blur: Theme.elevation.lg, color: Theme.colors.shadow, spread: 0 },
      radiusLgRef: null,
      radiusMdRef: null,
      radiusSmRef: null,

      // static layout values
      listH: panelH - 220,
      listW: panelW - 40,
      rowW: panelW - 40,
      qtyLeftX: panelW - 190,
      qtyCenterX: panelW - 140,
      qtyRightX: panelW - 100,
      removeX: panelW - 50,
      lineTotalX: panelW - 190,

      footerY: panelH - 140,
      footerW: panelW - 40,
      totalLabelX: panelW - 220,
      totalValueX: panelW - 120,

      checkoutY: panelH - 70,
      checkoutX: panelW - 20,

      centerX: panelW / 2,
      centerY: panelH / 2,

      // transitions (as primitive refs for .transition)
      slideTransitionValue: 1920,
      confirmTransitionValue: 0,

      // mount shortcuts to avoid inline object literals in template
      mountRight: 'x:1',
      mountCenter: 'x:0.5,y:0.5',
    }
  },
  hooks: {
    ready() {
      // create shader arrays once in code, not inline in template
      this.radiusLgRef = [this.$shader('radius', { radius: Theme.radii.lg })]
      this.radiusMdRef = [this.$shader('radius', { radius: Theme.radii.md })]
      this.radiusSmRef = [this.$shader('radius', { radius: Theme.radii.sm })]

      this.unsubscribe = cartStore.subscribe((snap) => {
        this.entries = snap.entries
        this.total = snap.total
      })
      const snap = cartStore.snapshot()
      this.entries = snap.entries
      this.total = snap.total
      this.$watch('open', (val) => {
        this.x = val ? 1920 - this.panelW - 20 : 1920 + 20
        // update slide transition target value (primitive used by :x.transition)
        this.slideTransitionValue = this.x
      })
    },
    detach() {
      if (this.unsubscribe) this.unsubscribe()
    },
  },
  computed: {
    formattedTotal() {
      return '$' + this.total.toFixed(2)
    },
  },
  methods: {
    // row y based on index passed from template to avoid relying on $index magic in precompiler
    $rowY(i) {
      return i * 80
    },
    $formatPrice(p) {
      return '$' + Number(p).toFixed(2)
    },
    $formatTotal(p, q) {
      return '$' + (Number(p) * Number(q)).toFixed(2)
    },
    $inc(item) {
      cartStore.update(item.id, item.quantity + 1)
    },
    $dec(item) {
      cartStore.update(item.id, item.quantity - 1)
    },
    $remove(item) {
      cartStore.remove(item.id)
    },
    $clear() {
      cartStore.clear()
    },
    $checkout() {
      const snap = cartStore.snapshot()
      if (snap.count === 0) return
      cartStore.clear()
      this.showConfirm = true
      this.confirmAlpha = 0
      // drive transition primitive value
      this.$nextTick(() => (this.confirmTransitionValue = 1))
    },
    $closeConfirm() {
      this.confirmTransitionValue = 0
      this.$setTimeout(() => (this.showConfirm = false), 220)
    },
  },
})
