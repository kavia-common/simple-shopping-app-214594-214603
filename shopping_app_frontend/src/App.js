import Blits from '@lightningjs/blits'
import Shop from './pages/Shop.js'
import { Theme } from './theme.js'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080">
      <!-- Bind precomputed background color object; avoid inline object literal -->
      <Rect w="1920" h="1080" :color="$backgroundColor" />
      <RouterView />
    </Element>
  `,
  state() {
    return {
      // Precompute gradient object in state to avoid inline literal in template bindings
      backgroundColor: { top: Theme.colors.gradientTop, bottom: Theme.colors.gradientBottom },
    }
  },
  // Ensure default route renders Shop page
  routes: [{ path: '/', component: Shop }],
})
