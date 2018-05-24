<template>
  <div></div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'index',
  computed: {
    ...mapState([
      'main'
    ])
  },
  methods: {
    ...mapActions(['GET_INDEX', 'SHOW_TEXT']),
    rigTextLinks () {
      const textLinks = document.querySelectorAll('.text-link')
      for (let i = 0; i < textLinks.length; i++) {
        textLinks[i].addEventListener('click', () => {
          this.SHOW_TEXT(textLinks[i].dataset.id)
        })
      }
    }
  },
  mounted () {
    if (!this.main.loaded.index) {
      this.GET_INDEX()
    } else {
      this.rigTextLinks()
    }
  },
  watch: {
    'main.loaded.index' () {
      this.rigTextLinks()
    }
  }
}
</script>
