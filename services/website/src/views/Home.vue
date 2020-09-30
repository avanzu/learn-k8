<template>
  <div class="home">
    <MapBox />
  </div>
</template>

<script>
// @ is an alias to /src

import MapBox from '@/components/MapBox.vue'
export default {
  name: 'Home',
  components: {
    MapBox    
  }
}
</script>
