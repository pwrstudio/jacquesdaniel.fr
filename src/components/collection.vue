<template>
  <div v-if='main.loaded.collection' class='grid align-end'>
    <div v-if='!main.loaded.text' @click='exit' id='exit'><span>exit collection</span></div>
    <item v-for='(item, index) in main.collection' :item='item'></item>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import item from './item'
export default {
  name: 'collection',
  components: {
    item
  },
  computed: {
    ...mapState([
      'main'
    ])
  },
  methods: {
    ...mapActions(['GET_COLLECTION']),
    exit () {
      this.$router.push({name: 'home'})
      // this.$router.push({name: 'home', params: {id: this.main.collectionId}})
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.GET_COLLECTION(this.$route.params.id)
    }
  },
  watch: {
    '$route' () {
      if (this.$route.params.id) {
        this.GET_COLLECTION(this.$route.params.id)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../style/helpers/_mixins.scss";
@import "../style/helpers/_responsive.scss";
@import "../style/_variables.scss";
@import "../style/_grid.scss";
@import "../style/_exit.scss";
</style>
