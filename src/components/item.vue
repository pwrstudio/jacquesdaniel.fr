<template>
  <div :id='"item-" + item.id' v-if='($route.name === "home" && mosaic && item.acf.show_in_front_page_mosaic) || $route.name === "search" || $route.name === "collection"' class='item'>
    <v-waypoint @waypoint-in="inHandler"></v-waypoint>
    <div :class='imageClass'>
      <template v-if='item.acf.mosaic_image.mime_type === "image/gif"'>
        <img v-if='item.acf.Image_display !== "None"' @click='openSingle' :src='item.acf.mosaic_image.url'>
        <img v-else :src='item.acf.mosaic_image.url' class='no-link'>
      </template>
      <template v-else >
        <a :href='item.acf.image_link' v-if='item.acf.link_image_to_collection && item.acf.mosaic_image.sizes && item.acf.mosaic_image.sizes["pwr-medium"]'>
          <img class='ksksks' :src='item.acf.mosaic_image.sizes["pwr-medium"]'>
        </a>
        <img v-else-if='item.acf.Image_display !== "None" && item.acf.mosaic_image.sizes && item.acf.mosaic_image.sizes["pwr-medium"]' @click='openSingle' :src='item.acf.mosaic_image.sizes["pwr-medium"]'>
        <img v-else-if='item.acf.mosaic_image.sizes && item.acf.mosaic_image.sizes["pwr-medium"]' :src='item.acf.mosaic_image.sizes["pwr-medium"]' class='no-link'>
      </template>
      <!-- <figcaption :class='{"shown": captionShown}'> -->
      <figcaption class='shown'>
        <cap :content='item.acf.caption'  :id='item.id' :links='item.acf.links'></cap>
      </figcaption>
    </div>
  </div>
</template>

<script>
import cap from './cap'
import { mapState, mapActions } from 'vuex'
import preloader from 'preloader'
export default {
  name: 'item',
  components: {
    cap,
  },
  data() {
    return {
      captionShown: false,
      loaded: false,
    }
  },
  props: ['item', 'index', 'mosaic'],
  computed: {
    ...mapState(['main']),
    imageClass() {
      if (this.item.acf.image_orienation === 'Vertical') {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    },
  },
  methods: {
    ...mapActions(['SET_N']),
    openSingle() {
      this.SET_N(this.index)
      this.$router.push({
        name: 'single',
        params: { id: this.item.id, slug: this.item.slug },
      })
    },
    inHandler() {
      if (!this.loaded) {
        if (this.item.acf.full_size_image) {
          let loader = preloader({
            xhrImages: false,
          })
          loader.add(this.item.acf.full_size_image.sizes['pwr-large'])
          loader.load()
        }
        this.loaded = true
      }
    },
  },
}
</script>

<style lang='scss' scoped>
@import '../style/helpers/_mixins.scss';
@import '../style/helpers/_responsive.scss';
@import '../style/_variables.scss';
.item {
  margin-right: 40px;
  margin-bottom: 6px;

  opacity: 1;

  @include screen-size('small') {
    margin-right: 35px;
    margin-left: 35px;
    margin-bottom: 6px;
  }

  figcaption {
    opacity: 1;
    max-width: 400px;
    padding-top: 8px;
    min-height: 80px;
    font-size: $font-size-large;
    line-height: $line-height-large;
    @include screen-size('small') {
      opacity: 1;
      font-size: $font-size-small;
      line-height: $line-height-small;
      &.shown {
        opacity: 1;
      }
    }
  }
  &:hover,
  &.active-item {
    figcaption {
      opacity: 1;
    }
  }
  .horizontal {
    width: 350px;
    @include screen-size('small') {
      width: 100%;
    }
  }
  .vertical {
    img {
      height: 350px;
    }
    @include screen-size('small') {
      width: 100%;
    }
  }
  img,
  iframe {
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
img {
  max-width: 100%;
  max-height: 100%;
}
.no-link {
  cursor: auto !important;
}
p {
  display: inline !important;
}
</style>
