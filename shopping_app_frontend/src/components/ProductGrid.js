import Blits from '@lightningjs/blits'
import ProductCard from './ProductCard.js'

export default Blits.Component('ProductGrid', {
  components: { ProductCard },
  props: ['products'],
  template: `
    <Element :w="$w" :h="$h">
      <For :each="$rowsArr" let="row">
        <Element :y="$rowY(row)">
          <For :each="$colsArr" let="col">
            <Element :x="$colX(col)">
              <ProductCard :product="$productAt(row, col)" />
            </Element>
          </For>
        </Element>
      </For>
    </Element>
  `,
  state() {
    const cols = 4
    const rows = 2
    const gap = 24
    const cardW = 380
    const rowH = 450
    return {
      w: 1920,
      h: 860,
      gap,
      cardW,
      rowH,
      cols,
      rows,
      rowsArr: Array.from({ length: rows }, (_, i) => i),
      colsArr: Array.from({ length: cols }, (_, i) => i),
    }
  },
  computed: {
    flatProducts() {
      return this.products || []
    },
  },
  methods: {
    $index(r, c) {
      return r * this.cols + c
    },
    $productAt(r, c) {
      const idx = this.$index(r, c)
      return this.flatProducts[idx] || null
    },
    $rowY(rIndex) {
      return rIndex * (this.rowH + this.gap)
    },
    $colX(cIndex) {
      return cIndex * (this.cardW + this.gap)
    },
  },
})
