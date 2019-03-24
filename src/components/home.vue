<template>
  <div class='grid align-end'>
    <item v-for='(item, index) in main.items' :item='item' mosaic='true'></item>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import item from './item'
export default {
  name: 'home',
  components: {
    item,
  },
  computed: {
    ...mapState(['main']),
  },
  methods: {
    ...mapActions(['GET_INDEX', 'SHOW_TEXT']),
    rigTextLinks() {
      const textLinks = document.querySelectorAll('.text-link')
      for (let i = 0; i < textLinks.length; i++) {
        textLinks[i].addEventListener('click', () => {
          this.SHOW_TEXT(textLinks[i].dataset.id)
        })
      }
    },
  },
  mounted() {
    if (!this.main.loaded.index) {
      this.GET_INDEX()
    } else {
      this.rigTextLinks()
    }
  },
}
</script>
