<template>
  <div>
    <span class='caption-text' v-html='noSpaceContent'></span>
    <span class='link-container' v-for='link in links'>
      <span v-if='link.link_type === "External"'>(<a :href='link.external_link' target=_blank>{{link.link_title}}</a>)</span>
      <span v-else-if='link.link_type === "Text"'>(<span class='text-link' :data-id='link.text_link.ID'>{{link.link_title}}</span>)</span>
    </span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'cap',
  props: ['content', 'links', 'id'],
  computed: {
    ...mapState(['main']),
    noSpaceContent() {
      return this.content.replace(/&nbsp;/g, '<div class="divider"></div>')
    }
  },
  methods: {
    closestByClass(el, clazz) {
      while (el.className !== clazz) {
        el = el.parentNode
        if (!el) {
          return null
        }
      }
      return el
    },
    ...mapActions(['SHOW_TEXT', 'SET_COLLECTION_ENTRY'])
  },
  mounted() {
    // Rig collection links
    const collectionLinks = this.$el.querySelectorAll('.collection-link')
    for (let i = 0; i < collectionLinks.length; i++) {
      collectionLinks[i].addEventListener('click', () => {
        this.SET_COLLECTION_ENTRY(this.id)
        this.$router.push({
          name: 'collection',
          params: {
            id: collectionLinks[i].dataset.id,
            slug: collectionLinks[i].dataset.href
          }
        })
      })
    }
    // Rig text links
    const textLinks = this.$el.querySelectorAll('.text-link')
    for (let i = 0; i < textLinks.length; i++) {
      textLinks[i].addEventListener('click', () => {
        let parent = this.closestByClass(this.$el, 'item')
        if (parent) {
          parent.classList.add('active-item')
          document.body.classList.add('no-scroll')
        }
        this.SHOW_TEXT(textLinks[i].dataset.id)
      })
    }
  }
}
</script>

<style lang='scss'>
@import '../style/helpers/_reset.css';
@import '../style/helpers/_mixins.scss';
@import '../style/helpers/_responsive.scss';
@import '../style/_variables.scss';

.link-container {
  display: inline;
  margin-right: 3px;
  margin-left: 1px;
  span {
    a,
    span {
      cursor: pointer;
      color: $grey;
      text-decoration: none;

      &:visited {
        color: $grey;
      }
      &:active {
        color: $grey;
      }
      &:hover {
        color: $black;
        text-decoration: underline;
      }
    }
  }
}

.caption-text {
  display: inline;
  p {
    // display: inline !important;
    margin-bottom: 12px;
    width: auto;
    br {
      width: 100px;
      background: red;
      height: 100px;
    }
  }

  br {
    display: inline-block;
    opacity: 0;
    height: 10px;
    width: 10px;
    background: red;
  }
}

.caption-container {
  .link-container {
    display: block;
    margin-top: 0px;
    margin-right: 0px;
    margin-left: 0px;
    &:nth-child(2) {
      margin-top: 10px;
      @include screen-size('small') {
        margin-top: 10px;
      }
    }
  }
}
</style>
