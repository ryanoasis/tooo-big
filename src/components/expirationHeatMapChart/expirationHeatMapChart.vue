<template>
  <v-card>
    <v-card-title>
    </v-card-title>
    <div>
      <apexcharts width="100%" height="300px" type="heatmap" :options="options" :series="series"></apexcharts>
    </div>
  </v-card>
</template>
<script src="./expirationHeatMapChart.js"></script>
<style scoped src="./expirationHeatMapChart.css"></style>
