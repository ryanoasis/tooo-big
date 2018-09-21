import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexcharts: VueApexCharts
  },
  props: ['dataSource'],
  data: function () {
    let newData = [
      {
        name: 'Metric1',
        data: this.generateData(20, {
          min: 0,
          max: 90
        })
      }
    ]
    return {
      options: {
        dataLabels: {
          enabled: false
        },
        colors: ['#008FFB'],
        xaxis: {
          type: 'category'
        },
        title: {
          text: 'HeatMap Chart (Single color)'
        }
      },
      series: newData
    }
  },
  created () {
  },
  watch: {
    dataSource () {
      console.log('series was', this.series)
      let newData = [
        {
          name: 'Metric1',
          data: this.generateData(20, {
            min: 0,
            max: 90
          })
        }
      ]
      this.series = newData
      console.log('series is now', this.series)
    }
  },
  mounted () {},
  methods: {
    generateData (count, yrange) {
      var i = 0
      let series = []
      while (i < count) {
        var x = (i + 1).toString()
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

        series.push({
          x: x,
          y: y
        })
        i++
      }
      return series
    }
  }
}
