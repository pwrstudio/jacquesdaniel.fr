<template>
  <div v-if='main.loaded.search' class='grid align-end'>
    <div v-if='!main.loaded.text' @click='exit' id='exit'><span>exit search</span></div>
    <item v-for='(item, index) in main.search' :index='index' :item='item'></item>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import item from './item'
export default {
  name: 'search',
  components: {
    item
  },
  computed: {
    ...mapState([
      'main'
    ])
  },
  methods: {
    ...mapActions(['GET_SEARCH']),
    exit () {
      this.$router.push({name: 'home'})
    }
  },
  mounted () {
    if (this.$route.params.term) {
      this.GET_SEARCH(this.$route.params.term)
    }
  }
}
</script>

<style lang='scss'>
@import "../style/helpers/_mixins.scss";
@import "../style/helpers/_responsive.scss";
@import "../style/_variables.scss";
@import "../style/_grid.scss";
@import "../style/_exit.scss";

</style>
