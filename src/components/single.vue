<template>
  <div class='single-container' v-if='main.loaded.single'>
    <div v-if='!main.loaded.text' @click='exit' id='exit'><span>exit full-screen</span></div>
    <!-- Images: audio -->
    <div id="audio-container" v-if='main.single.acf.audio'>
      <audio :src='main.single.acf.audio.url' controls></audio>
    </div>
    <!-- Images: video -->
    <div id="video-container" v-if='main.single.acf.video'>
      <iframe :src="'https://player.vimeo.com/video/' + main.single.acf.video + '?title=0&byline=0&portrait=0'" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <!-- Images: full-screen -->
    <img v-else-if='main.single.acf.Image_display === "Full screen" && mainImage.length > 0' :src='mainImage' class='full'>
    <!-- Images: fitted -->
    <img v-else :src='mainImage' class='fit'>
    <div v-if='main.horizontal.context && main.horizontal.context.length > 0'>
      <div @click='prevItem' class='nav prev'></div>
      <div @click='nextItem' class='nav next'></div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import objectFitImages from 'object-fit-images'
import noframe from 'reframe.js/dist/noframe.js'
import preloader from 'preloader'
export default {
  name: 'single',
  computed: {
    ...mapState([
      'main'
    ])
  },
  data () {
    return {
      title: '',
      mainImage: '',
      nextIndex: 0,
      prevIndex: 0,
      collectionLength: 0
    }
  },
  methods: {
    ...mapActions(['RESET_SINGLE_ITEM', 'CHANGE_SINGLE', 'GET_SINGLE', 'SET_N']),
    updateItem () {
      this.RESET_SINGLE_ITEM()
      const id = this.$route.params.id
      if (id) {
        let newItem = this.main.items.find((item) => {
          return item.id === id
        })
        if (newItem) {
          this.CHANGE_SINGLE(newItem)
        } else {
          this.GET_SINGLE(id)
        }
      }

      // console.log('single, updateItem', id)
    },
    nextItem () {
      this.mainImage = ''
      this.$router.push({name: 'single', params: {id: this.main.horizontal.context[this.nextIndex].id, slug: this.main.horizontal.context[this.nextIndex].slug}})
    },
    prevItem () {
      this.mainImage = ''
      this.$router.push({name: 'single', params: {id: this.main.horizontal.context[this.prevIndex].id, slug: this.main.horizontal.context[this.prevIndex].slug}})
    },
    exit () {
      if (this.main.horizontal.parent === 'search') {
        this.$router.push({name: 'search', params: {term: this.main.searchTerm}})
      } else if (this.main.horizontal.parent === 'collection') {
        this.$router.push({name: 'collection', params: {id: this.main.collectionId}})
      } else {
        this.$router.push({name: 'home'})
      }
    }
  },
  mounted () {
    this.collectionLength = this.main.horizontal.context.length
    this.updateItem()
  },
  watch: {
    'main.loaded.single' () {
      setTimeout(() => {
        if (this.main.single.acf.full_size_image) {
          if (this.main.single.acf.full_size_image.mime_type === 'image/gif') {
            this.mainImage = this.main.single.acf.full_size_image.url
          } else {
            this.mainImage = this.main.single.acf.full_size_image.sizes['pwr-large']
          }
        }
        // Set index of next post in horizontal nav
        this.nextIndex = 0
        if (this.main.horizontal.index < this.collectionLength - 1) {
          this.nextIndex = parseInt(this.main.horizontal.index) + 1
        }
        // Set index of previous post in horizontal nav
        this.prevIndex = this.collectionLength - 1
        if (this.main.horizontal.index > 0) {
          this.prevIndex = this.main.horizontal.index - 1
        }
        // Preload full size images of next/prev
        let loader = preloader({
          xhrImages: false
        })
        if (this.main.horizontal.context[this.prevIndex].acf.full_size_image) {
          loader.add(this.main.horizontal.context[this.prevIndex].acf.full_size_image.sizes['pwr-large'])
        }
        if (this.main.horizontal.context[this.nextIndex].acf.full_size_image) {
          loader.add(this.main.horizontal.context[this.nextIndex].acf.full_size_image.sizes['pwr-large'])
        }
        loader.load()
      }, 50)
      if (this.main.horizontal.context) {
        for (let i = 0; i < this.main.horizontal.context.length; i++) {
          if (this.main.horizontal.context[i].id === this.main.single.id) {
            this.SET_N(i)
          }
        }
      }
      setTimeout(() => {
        if (this.main.single.acf && this.main.single.acf.video) {
          console.log('reframe')
          noframe('iframe')
        } else if (this.main.single.acf && this.main.single.acf.Image_display === 'Full screen') {
          objectFitImages()
        }
      }, 200)
    },
    '$route' () {
      this.updateItem()
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../style/helpers/_mixins.scss";
@import "../style/helpers/_responsive.scss";
@import "../style/_variables.scss";
@import "../style/_exit.scss";

.single-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

img {
  &.full {
    width: 100%;
    height: 100%;
    object-fit: cover;
    font-family: 'object-fit: cover;';
  }
  &.fit {
    width: auto;
    height: auto;
    max-width: 100vw;
    max-height: 100vh;
    &[src=""]{
      visibility: hidden;
    }
  }
}

.nav {
  position: fixed;
  top: 0;
  height: 100%;
  width: 50%;
  z-index: 1;
  &.prev {
    left: 0;
    cursor: url('../assets/img/control-prev.png'), w-resize;
  }
  &.next {
    left: 50%;
    cursor: url('../assets/img/control-next.png'), e-resize;
  }
}

#video-container {
  z-index: 100;
  width: 720px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  position: absolute;
  @include center;
}

#audio-container {
  z-index: 100;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  position: absolute;
  @include center;
}

</style>
