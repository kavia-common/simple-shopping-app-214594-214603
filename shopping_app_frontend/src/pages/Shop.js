import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'
import Header from '../components/Header.js'
import ProductGrid from '../components/ProductGrid.js'
import CartPanel from '../components/CartPanel.js'
import { products } from '../data/products.js'
import { cartStore } from '../store/cart.js'

export default Blits.Component('Shop', {
  components: { Header, ProductGrid, CartPanel },
  template: `
    <Element w="1920" h="1080">
      <Rect w="1920" h="1080" :color="$backgroundColor" />
      <Header :count="$count" :total="$total" />
      <Element x="40" y="120" :effects="$surfaceRadiusEffect">
        <Rect w="1300" h="860" :color="$surfaceColor" />
        <Element x="24" y="24">
          <ProductGrid :products="$products" />
        </Element>
      </Element>
      <CartPanel :open="$cartOpen" />
      <Element :mount="$mountRight" x="1880" y="100" :effects="$pillRadiusEffect" @enter="$toggleCart">
        <Rect w="44" h="44" :color="$primaryColor" />
        <Text x="10" y="8" size="26" color="#fff" content="🛒" />
      </Element>
    </Element>
  `,
  state() {
    return {
      // Theme-bound colors (avoid inline literals in template)
      backgroundColor: { top: Theme.colors.gradientTop, bottom: Theme.colors.gradientBottom },
      surfaceColor: Theme.colors.surface,
      primaryColor: Theme.colors.primary,

      // Place effect arrays in state (created in ready to access this.$shader)
      surfaceRadiusEffect: null,
      pillRadiusEffect: null,

      products,
      count: 0,
      total: 0,
      cartOpen: false,

      mountRight: 'x:1',
    }
  },
  hooks: {
    ready() {
      // Create shader arrays when component is ready
      this.surfaceRadiusEffect = [this.$shader('radius', { radius: Theme.radii.xl })]
      this.pillRadiusEffect = [this.$shader('radius', { radius: 999 })]

      // subscribe to cart
      this.unsubscribe = cartStore.subscribe((snap) => {
        this.count = snap.count
        this.total = snap.total
      })
      const snap = cartStore.snapshot()
      this.count = snap.count
      this.total = snap.total
    },
    detach() {
      if (this.unsubscribe) this.unsubscribe()
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    $toggleCart() {
      /** Toggle cart drawer open/close. */
      this.cartOpen = !this.cartOpen
    },
  },
})
