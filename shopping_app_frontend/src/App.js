import Blits from '@lightningjs/blits'
import Shop from './pages/Shop.js'
import { Theme } from './theme.js'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" :color="$bgGradient">
      <RouterView />
    </Element>
  `,
  state() {
    return {
      bgGradient: { top: Theme.colors.gradientTop, bottom: Theme.colors.gradientBottom },
    }
  },
  routes: [{ path: '/', component: Shop }],
})
