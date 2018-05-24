<template>
  <div @click='overlayClick' id='overlay'>
    <div id='textbox'>
      <div class='handle top'></div>
      <div class='handle bottom'></div>
      <div class='handle left'></div>
      <div class='handle right'></div>
      <div @click='closeClick' id='close-text'>close</div>
      <div v-if="main.text.acf.pdf" id='download'>(<a :href="main.text.acf.pdf.url" target=_blank>download/print</a>)</div>
      <h1></h1>
      <article>
        <div v-html='main.text.acf.text'></div>
        <span class='link-container' v-for='link in main.text.acf.links'>
          <span>(<a :href='link.link' target=_blank>{{link.title}}</a>)</span>
        </span>
      </article>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import interact from 'interactjs'
export default {
  name: 'txt',
  computed: {
    ...mapState([
      'main'
    ])
  },
  methods: {
    ...mapActions(['HIDE_TEXT']),
    overlayClick (e) {
      if (e.target.attributes.id && e.target.attributes.id.value === 'overlay') {
        let parent = document.querySelector('.active-item')
        if (parent) {
          parent.classList.remove('active-item')
        }
        document.body.classList.remove('no-scroll')
        this.HIDE_TEXT()
      }
    },
    closeClick () {
      document.body.classList.remove('no-scroll')
      this.HIDE_TEXT()
    }
  },
  mounted () {
    function dragMoveListener (event) {
      let target = event.target
      console.dir(event.target)
      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
    // if not mobile
    if (!window.matchMedia('(max-device-width: 700px)').matches) {
      interact('#textbox').draggable({onmove: dragMoveListener})
      interact('#textbox').allowFrom('.handle')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../style/helpers/_mixins.scss";
@import "../style/helpers/_responsive.scss";
@import "../style/_variables.scss";
@import "../style/_textbox.scss";
</style>
