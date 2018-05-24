<template>
  <div @click='overlayClick' id='overlay'>
    <div id='textbox'>
      <div class='handle top'></div>
      <div class='handle bottom'></div>
      <div class='handle left'></div>
      <div class='handle right'></div>
      <div @click='HIDE_SHARE' id='close-text'>close</div>
      <article>
        <h1></h1>
        <div class='share-item'><a class='facebook' :href='shareFacebook' target=_blank>facebook</a></div>
        <div class='share-item'><a class='twitter' :href='shareTwitter' target=_blank>twitter</a></div>
        <div v-if='!copied' class='share-item'><span class='url-copy' @click='copyURL'>copy url</span></div>
        <div v-if='copied' class='share-item'>URL copied</div>
      </article>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import interact from 'interactjs'
import copy from 'copy-to-clipboard'
const FACEBOOK = 'https://www.facebook.com/sharer/sharer.php?u='
const TWITTER = 'https://twitter.com/home?status='
export default {
  name: 'share',
  data () {
    return {
      copied: false
    }
  },
  computed: {
    ...mapState([
      'main'
    ]),
    shareFacebook () {
      let url = 'http://clairefontaine.ws/item/' + this.main.single.id + '/' + this.main.single.slug
      return FACEBOOK + encodeURI(url)
    },
    shareTwitter () {
      let text = this.main.single.title.rendered + ' ' + 'http://clairefontaine.ws/item/' + this.main.single.id + '/' + this.main.single.slug
      return TWITTER + encodeURI(text)
    }
  },
  methods: {
    ...mapActions(['HIDE_SHARE']),
    copyURL () {
      copy('http://clairefontaine.ws/item/' + this.main.single.id + '/' + this.main.single.slug)
      this.copied = true
    },
    overlayClick (e) {
      if (e.target.attributes.id.value === 'overlay') {
        let parent = document.querySelector('.active-item')
        if (parent) {
          parent.classList.remove('active-item')
        }
        this.HIDE_SHARE()
      }
    }
  },
  mounted () {
    function dragMoveListener (event) {
      let target = event.target
      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
    // if not mobile
    if (!window.matchMedia('(max-device-width: 700px)').matches) {
      interact('#textbox').draggable({onmove: dragMoveListener})
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../style/helpers/_mixins.scss";
@import "../style/helpers/_responsive.scss";
@import "../style/_variables.scss";
@import "../style/_textbox.scss";
.share-item {
  margin-bottom: $line-height;
  span {
    cursor: pointer;
    color: $grey;
    &:hover {
      color: black;
      text-decoration: underline;
    }
    &:visited {
      color: $grey;
    }
  }
}
.facebook {
  color: rgba(0, 86, 214, 1);
  &:hover {
    color: rgba(0, 86, 214, 1) !important;
  }
}
.twitter {
  color: rgba(0, 199, 252, 1);
  &:hover {
    color: rgba(0, 199, 252, 1) !important;
  }
}
.url-copy {
  color: rgba(177, 140, 254, 1) !important;
  &:hover {
    color: rgba(177, 140, 254, 1) !important;
  }
}
</style>
