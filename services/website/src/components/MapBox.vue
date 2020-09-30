<template>
  <div class="map-wrapper">
    <div class="row">
        <div class="col s12">
      <a 
        href="!#"
        class="waves-effect waves-light btn-small"
        v-for="item in parameters"
        :key="item"
        @click.prevent="selectParameter(item)"
      >
        {{ item }}
      </a>
      </div>
    </div>
    <div class="row">
        <div class="col s12">
            <div class="aligner">
                <div data-role="mapbox-map" :id="id" class="map-view"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import v4 from "uuid/dist/v4";
import axios from "axios";
mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

export default {
  name: "MapBox",
  data: () => ({
    id: "",
    map: null,
    origin: null,
    measurements: {},
    loading: false,
    selectedParameter: null,
    from: null,
    colors: {
      co: "#7b1fa2",
      no2: "#880e4f",
      o3: "#3949ab",
      pm10: "#00695c",
      pm25: "#1b5e20",
    },
  }),
  computed: {
    parameters() {
      return Object.keys(this.measurements);
    },
  },
  created() {
    this.id = v4();
    this.from = new Date(Date.now() - 86400000 * 90).toISOString();
  },
  mounted() {
    axios({
      baseURL: process.env.VUE_APP_API,
      url: "/air-quality/measurements",
      params: { criteria: "munich", from: this.from },
    })
      .then(this.updateData)
      .then(this.generateMap)
      .then(this.registerMapListener)
      .then(this.centerMapOnOrigin);
  },
  methods: {
    generateMap() {
      this.map = new mapboxgl.Map({
        container: this.id,
        style: "mapbox://styles/mapbox/dark-v10",
        zoom: 10,
      });
    },
    updateData({ data }) {
      this.origin = data.origin;
      this.measurements = data.measurements;
    },
    registerMapListener() {
      this.map.on("load", this.placeMeasurements);
    },
    centerMapOnOrigin() {
      this.origin && this.map.setCenter(this.origin.geometry.coordinates);
    },
    selectParameter(e) {
      this.selectedParameter !== e &&
        this.removeLayer(this.selectedParameter).addLayer(e);
      this.selectedParameter = e;
    },
    removeLayer(parameter) {
      parameter && this.map.removeLayer(parameter);
      // parameter && this.map.removeLayer(`${parameter}-text`);
      parameter && this.map.removeLayer(`${parameter}-heat`);
      return this;
    },
    addLayer(measurement) {
      this.map.addLayer({
        id: measurement,
        type: "circle",
        source: measurement,
        paint: {
          "circle-radius": 6,
          "circle-color": this.colors[measurement],
        },
      });
    //   this.map.addLayer({
    //     id: `${measurement}-text`,
    //     type: "symbol",
    //     source: measurement,
    //     layout: {
    //       "text-field": ["get", "parameter"],
    //       "text-offset": [0, 1.25],
    //     },
    //   });
      this.map.addLayer({
        id: `${measurement}-heat`,
        type: "heatmap",
        source: measurement,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "value"],
            0,
            0,
            6,
            1,
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          // "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      });
    },
    placeMeasurements() {
      Object.keys(this.measurements).forEach((measurement) => {
        this.map.addSource(measurement, {
          type: "geojson",
          data: this.measurements[measurement],
        });
      });
    },
  },
};
</script>

<style>
.aligner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-view {
  height: 90vh;
  width: 80vw;
}
</style>