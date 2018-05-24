<template>
  <div class='grid align-end'>
    <item v-for='(item, index) in main.items' :item='item' mosaic='true'></item>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import item from './item'
export default {
  name: 'home',
  components: {
    item
  },
  computed: {
    ...mapState([
      'main'
    ])
  }
}
</script>
