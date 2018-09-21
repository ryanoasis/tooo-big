import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexcharts: VueApexCharts
  },
  props: ['dataSource1', 'dataSource2'],
  data () {
    return {
      options: {
        theme: {
          palette: 'palette3',
          monochrome: { // monochrome allows you to select just 1 color and fill out the rest with light/dark shade (intensity can be selected)
            enabled: true,
            color: '#008FFB',
            shadeTo: 'light',
            shadeIntensity: 0.65
          }
        },
        xaxis: {
          categories: ['']
        }
      },
      series: [{
        name: 'Expirations',
        data: []
      },
      {
        name: 'Total',
        data: []
      }]
    }
  },
  created () {
  },
  watch: {
    dataSource1 () {
      this.series[0].data = Object.values(this.dataSource1)
      this.series[1].data = Object.values(this.dataSource2)
      this.options = {
        xaxis: {
          categories: Object.keys(this.dataSource1)
        }
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
