<template>
  <v-card>
    <v-card-title>
    </v-card-title>
    <div>
      <apexcharts width="100%" height="300px" type="bar" :options="options" :series="series"></apexcharts>
    </div>
  </v-card>
</template>
<script src="./bucketChart.js"></script>
<style scoped src="./bucketChart.css"></style>
