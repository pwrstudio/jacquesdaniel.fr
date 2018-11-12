<template>
  <div id="app">
    <menu>
      <header :class='{"semi": $route.name === "index"}'>
        <div class='logo'>
          <span class='home-link'
                @click='toHome'
                id='logo'>Jacques Daniel</span>
        </div>
        <div class='about'>
          <router-link v-if='main.loaded.index && $route.name !== "index" && $route.name !== "single"'
                       to='/index'
                       id='index'>archive</router-link>
        </div>
        <div v-if='$route.name === "home" || $route.name === "collection"'><input type='text'
                 placeholder='search'
                 v-model='searchTerm'
                 @keyup.enter='submitSearch'></input>
        </div>
        <div v-if='$route.name === "search" && main.search.length > 0'
             id='search-marker'>search results ({{main.search.length}}): {{main.searchTerm}}</div>
        <div v-else-if='$route.name === "search" && main.search.length < 1'>no results</div>
      </header>
      <div v-if='$route.name === "index" || $route.name === "single"'
           id='text-container'
           :class='{"index": $route.name === "index" }'>
        <div :class='{"inner": $route.name === "index" }'>
          <div v-if='main.loaded.single'
               class='caption-container'>
            <cap v-if='main.single.acf.extended_caption_check'
                 :content='main.single.acf.extended_caption'
                 :links='main.single.acf.links'></cap>
            <cap v-else
                 :content='main.single.acf.caption'
                 :links='main.single.acf.links'></cap>
            <div class='share'>(<span class='share-toggle'
                    @click='SHOW_SHARE'>share</span>)</div>
          </div>
          <div v-if='$route.name === "index" && main.loaded.index'
               id='index-container'>
            <div v-html='main.index.acf.text'></div>
          </div>
        </div>
      </div>
    </menu>
    <router-view></router-view>
    <txt v-if='main.loaded.text' />
    <share v-if='main.loaded.share' />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import cap from './components/cap'
import txt from './components/txt'
import share from './components/share'

export default {
  name: 'app',
  components: {
    cap,
    txt,
    share
  },
  data() {
    return {
      searchTerm: '',
      filter: {
        extended: false,
        id: 0
      },
      timeNow: {},
      timeFormat: '',
      dateFormat: '',
      scrollY: 0,
      isInsideCollection: false,
      cachedSingleId: -1
    }
  },
  computed: {
    ...mapState(['main'])
  },
  methods: {
    ...mapActions([
      'GET_ITEMS',
      'GET_INDEX',
      'GET_COLLECTIONS',
      'GET_ALL_TEXTS',
      'SHOW_TEXT',
      'SET_FILTER',
      'RESET_SINGLE_ITEM',
      'SET_CONTEXT',
      'RESET_COLLECTION',
      'RESET_SEARCH',
      'HIDE_TEXT',
      'SHOW_SHARE',
      'HIDE_SHARE'
    ]),
    submitSearch() {
      this.$router.push({ name: 'search', params: { term: this.searchTerm } })
    },
    scrollToItem(id) {
      setTimeout(() => {
        if (id && document.getElementById('item-' + id) != null) {
          window.scrollTo(
            0,
            document.getElementById('item-' + id).offsetTop - 40
          )
        } else {
          window.scrollTo(0, this.scrollY)
        }
        // }, 20)
      }, 250)
    },
    toHome() {
      if (this.$route.name === 'home') {
        window.scrollTo(0, 0)
      } else {
        this.RESET_SINGLE_ITEM()
        this.$router.push({ name: 'home' })
      }
    },
    toggleFilter(e) {
      this.SET_FILTER(0)
      this.filter.extended = !this.filter.extended
    }
  },
  mounted() {
    this.GET_ITEMS()
    this.GET_INDEX()
    this.GET_ALL_TEXTS()
    this.$router.beforeEach((to, from, next) => {
      if (
        from.name === 'single' &&
        to.name === 'single' &&
        !this.isInsideCollection
      ) {
        this.cachedSingleId = to.params.id
      }

      if (from.name === 'search' && to.name === 'single') {
        this.scrollY =
          (window.pageYOffset || document.documentElement.scrollTop) -
          (document.documentElement.clientTop || 0)
        this.SET_CONTEXT({
          data: this.main.search.filter(item => {
            return item.acf.Image_display !== 'None'
          }),
          parent: 'search'
        })
      }
      if (from.name === 'collection' && to.name === 'single') {
        this.isInsideCollection = true
        this.SET_CONTEXT({
          data: this.main.collection.filter(item => {
            return item.acf.Image_display !== 'None'
          }),
          parent: 'collection'
        })
      }
      if (from.name === 'home' && to.name === 'single') {
        this.scrollY =
          (window.pageYOffset || document.documentElement.scrollTop) -
          (document.documentElement.clientTop || 0)
        this.SET_CONTEXT({
          data: this.main.items.filter(item => {
            return (
              item.acf.show_in_front_page_mosaic &&
              item.acf.Image_display !== 'None'
            )
          }),
          parent: 'home'
        })
      }
      if (from.name === 'search' && to.name !== 'single') {
        this.searchTerm = ''
        this.RESET_SEARCH()
      }
      if (to.name === 'home' || to.name === 'search' || to.name === 'index') {
        this.RESET_COLLECTION()
      }
      if (
        from.name === 'single' &&
        (to.name === 'home' || to.name === 'collection' || to.name === 'search')
      ) {
        this.scrollToItem(this.main.single.id)
      }
      if (from.name === 'collection' && to.name === 'home') {
        this.isInsideCollection = false
        if (this.main.collectionEntry) {
          this.scrollToItem(this.main.collectionEntry)
        } else {
          // console.log('using cachSingleId', this.cachedSingleId)
          this.scrollToItem(this.cachedSingleId)
        }
      }
      if (from.name === 'single') {
        this.RESET_SINGLE_ITEM()
      }
      this.HIDE_TEXT()
      this.HIDE_SHARE()
      next()
    })
  },
  watch: {
    'main.offset'() {
      if (this.main.offset <= this.main.pages) {
        this.GET_ITEMS()
      }
    }
  }
}
</script>

<style lang='scss'>
@import './style/helpers/_reset.css';
@import './style/helpers/_mixins.scss';
@import './style/helpers/_responsive.scss';
@import './style/_variables.scss';
@import './style/_exit.scss';
// @import './assets/fonts/readingsans/styles.css';
// @import './assets/fonts/readingsans-italics/styles.css';
@import './assets/fonts/readingserif/styles.css';
@import './assets/fonts/readingserif-italic/styles.css';

body {
  @include hide-scroll;
}

#app {
  font-family: $sans-serif-stack;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: $font-size-large;
  line-height: $line-height-large;
  @include screen-size('small') {
    font-size: $font-size-small;
    line-height: $line-height-small;
  }
}

a {
  color: $grey;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    color: $black !important;
    text-decoration: underline;
    background: rgba(255, 255, 255, 0.8);
    @include screen-size('small') {
      text-decoration: none;
    }
  }
  &:visited {
    color: $grey;
  }
  &:active {
    color: $grey;
  }
}
menu {
  position: fixed;
  top: 0;
  left: 30px;
  overflow: visible;
  @include screen-size('small') {
    left: 20px;
  }
  z-index: 1000;
  input {
    outline: none;
    border: none;
    font-size: $font-size-large;
    font-family: $sans-serif-stack;
    background: transparent;
    opacity: 1;
    padding-left: 1px;
    padding: 0 !important;
    margin-left: 0;
    line-height: $line-height;
    position: relative;
    @include screen-size('small') {
      font-size: $font-size-small;
      &::placeholder {
        position: relative;
        left: -1px;
      }
    }
  }
}
header {
  position: absolute;
  top: 0;
  padding-top: 34px;
  @include screen-size('small') {
    padding-top: 24px;
  }
  left: 0px;
  width: 400px;
  max-width: 95vw;
  div {
    margin-bottom: 14px;
    &.logo {
      margin-bottom: 14px;
      @include screen-size('small') {
        margin-bottom: 10px;
      }
    }
    &.about {
      margin-bottom: 16px;
      @include screen-size('small') {
        margin-bottom: 12px;
      }
    }
    @include screen-size('small') {
      margin-bottom: 10px;
    }
  }
  @include screen-size('small') {
    width: 400px;
    max-width: 85vw;
  }
  z-index: 1000;
  &.semi {
    width: 100vw;
    background: rgba(255, 255, 255, 0.9);
    -webkit-box-shadow: 0px 0px 10px 10px #fff !important;
    box-shadow: 0px 0px 10px 10px #fff !important;
    div {
      margin-bottom: 0 !important;
    }
  }
  a,
  .home-link {
    color: black;
    cursor: pointer;
    text-decoration: none;
    padding-top: 1px;
    &:hover {
      color: black;
      text-decoration: underline;
      background: rgba(255, 255, 255, 0.8);
    }
    &:visited {
      color: black;
    }
    &:active {
      color: black;
    }
  }
}
#text-container {
  position: absolute;
  left: 0px;
  top: 0;
  max-height: 100vh;
  width: 300px;
  z-index: 1;
  // padding-right: 10px;
  overflow: hidden;
  padding-top: 64px;
  @include screen-size('small') {
    padding-top: 50px;
  }
  &.index {
    padding-top: 0;
  }
  .inner {
    padding-top: 63px;
    @include screen-size('small') {
      padding-top: 50px;
    }
    margin-right: -16px;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100vh;
    @include hide-scroll;
    p:last-child {
      margin-bottom: $line-height;
    }
    .link-container {
      display: block;
      a {
        color: $grey;
        text-decoration: none;
        padding-top: 1px;
        &:hover {
          color: $black;
          text-decoration: underline;
          background: rgba(255, 255, 255, 0.9);
        }
        &:visited {
          color: $grey;
        }
        &:active {
          color: $grey;
        }
      }
    }
  }
  @include hide-scroll;
  @include screen-size('small') {
    width: 85vw;
  }
}
.caption-container {
  margin-bottom: 14px;
  @include screen-size('small') {
    max-width: 300px;
  }
}
.collection-link {
  color: $grey;
  padding-top: 1px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: $black;
    background: rgba(255, 255, 255, 0.8);
  }
}
em {
  font-style: italic;
}
.text-link {
  cursor: pointer;
  color: $grey;
  text-decoration: none;
  padding-top: 1px;
  &:hover {
    color: $black;
    text-decoration: underline;
    background: rgba(255, 255, 255, 0.8);
  }
  &:visited {
    color: $grey;
  }
  &:active {
    color: $grey;
  }
}
#index-container {
  p {
    padding-right: 24px;
  }
  a {
    color: $grey;
    text-decoration: none;
    &:hover {
      color: $black;
      text-decoration: underline;
      background: rgba(255, 255, 255, 0.8);
    }
    &:visited {
      color: $grey;
    }
    &:active {
      color: $grey;
    }
  }
  padding-bottom: $line-height * 10;
  @include hide-scroll;
}

.share {
  margin-top: 16px;
}

.share-toggle {
  cursor: pointer;
  color: $grey;
  text-decoration: none;
  padding-top: 1px;
  &:hover {
    color: $black;
    text-decoration: underline;
    background: rgba(255, 255, 255, 0.8);
  }
  &:visited {
    color: black;
  }
  &:active {
    color: black;
  }
}
#logo {
  white-space: nowrap;
}

.no-scroll {
  overflow: hidden;
}

#filter {
  position: fixed;
  top: 34px;
  right: 36px;
  @include screen-size('small') {
    top: 10px;
    right: 20px;
  }
  z-index: 10000;
  &:hover {
    span {
      color: $black;
      text-decoration: underline;
      background: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding-top: 1px;
    }
  }
}

.filter-item {
  display: block;
  cursor: pointer;
  &:hover,
  &.active {
    text-decoration: underline;
  }
}

#search-marker {
  white-space: nowrap;
}

.counter {
  width: 3.62em;
  // background: red;
  display: inline-block;
}

#index {
  &:hover {
    span {
      text-decoration: underline;
    }
  }
}
</style>
