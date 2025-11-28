import Blits from '@lightningjs/blits'

import Loader from '../components/Loader.js'
import Button from '../components/Button.js'

const colors = ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa']

export default Blits.Component('Home', {
  components: {
    Loader,
    Button,
  },
  template: `
    <Element w="1920" h="1080" color="#1e293b">
      <Element :y.transition="$y">
        <Element
          src="assets/logo.png"
          w="200"
          h="200"
          :scale.transition="$logoScale"
          :rotation.transition="$logoRotation"
          :x.transition="$logoX"
          :mount="$mountCenterX"
          y="320"
          :effects="$logoRadiusEffect"
        />
        <Loader :x="$halfW" :mount="$mountCenterX" y="600" w="160" :alpha.transition="$loaderAlpha" :loaderColor="$color" />
        <Element y="600" :alpha.transition="$textAlpha">
          <Text size="80" align="center" maxwidth="1920">Hello!</Text>
          <Text
            size="50"
            align="center"
            y="120"
            :x="$halfW"
            maxwidth="500"
            lineheight="64"
            :mount="$mountCenterX"
            color="#ffffffaa"
            content="Let's get started with Lightning 3 & Blits"
          />
        </Element>
      </Element>
        <Element w="13.5%" h="40" x="43%" y="10%" :color="$headerGradient">
          <Button ref="btn" />
        </Element>
    </Element>
  `,
  state() {
    return {
      /**
       * Y-position of the entire page contents
       * @type {number}
       */
      y: 0,
      /**
       * X-position of the logo, used to create slide in transition
       * @type {number}
       */
      x: -1000,
      /**
       * Rotation of the logo, used to create a spinning transition
       * @type {number}
       */
      rotation: 0,
      /**
       * Scale of the logo, used to create a zoom-in / zoom-out transition
       * @type {number}
       */
      scale: 1,
      /**
       * Alpha of the loader component, used to create a fade-in / fade-out transition
       * @type {number}
       */
      loaderAlpha: 0,
      /**
       * Alpha of the text, used to create a fade-in transition
       * @type {number}
       */
      textAlpha: 0,
      /**
       * Color passed into the loader component
       * @type {string}
       */
      color: '',

      // Derived bindings to avoid inline objects in template
      halfW: 1920 / 2,
      mountCenterX: 'x:0.5',
      headerGradient: { top: '#763efb', bottom: '#433484' },
      logoRadiusEffect: null,
      logoScale: { value: 1, duration: 500 },
      logoRotation: { value: 0, duration: 800 },
      logoX: { value: -1000, delay: 200, duration: 1200, easing: 'cubic-bezier(1,-0.64,.39,1.44)' },
    }
  },
  hooks: {
    ready() {
      // setup radius shader array for the logo
      this.logoRadiusEffect = [this.$shader('radius', { radius: 8 })]

      this.rotateColors(200)

      this.loaderAlpha = 1
      this.x = 1920 / 2
      this.logoX = { ...this.logoX, value: this.x }

      this.$setTimeout(() => {
        this.rotation = 720
        this.scale = 1.5
        this.logoRotation = { ...this.logoRotation, value: this.rotation }
        this.logoScale = { ...this.logoScale, value: this.scale }
      }, 3000)

      this.$setTimeout(() => {
        this.scale = 1
        this.logoScale = { ...this.logoScale, value: this.scale }
      }, 3000 + 300)

      this.$setTimeout(() => {
        this.y = -60
        this.loaderAlpha = 0
        this.scale = 1
        this.textAlpha = 1
        this.logoScale = { ...this.logoScale, value: this.scale }
      }, 6000)
    },
    focus() {
      this.$select('btn').$focus() // Select the button with the ref 'btn'
    },
  },
  methods: {
    /**
     * Method to rotate the colors of the loader
     * @param {number} interval - interval in ms
     */
    rotateColors(interval) {
      let i = 0
      this.$setInterval(() => {
        i++
        if (i >= colors.length) i = 0
        this.color = colors[i]
      }, interval)
    },
  },
})
