
import {AgGridVue} from 'ag-grid-vue'
import moment from 'moment'
// import axios from 'axios'
import fullListGrid from '../fullListGrid/fullListGrid.vue'
// import api from '../../services/api.js'

export default {
  name: 'Dashboard',
  data () {
    return {
      apiTest: 'nope',
      filterByType: '',
      filterByName: '',
      filterByStore: '',
      gridApi: {},
      columnDefs: null,
      columnDefsBucket: null,
      columnDefsBucketMini: null,
      rowData: null,
      title: 'Tooo Big',
      showDialog: {},
      showLoading: true,
      foodPurchasedAfterExpiration: {
        total: 0
      },
      fridge: [],
      foodStores: {},
      foodNames: {},
      foodTypes: {}
    }
  },
  methods: {
    onGridReady (params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    sortedAsArray (obj) {
      let data = Object.keys(obj).sort()
      return data.sort((a, b) => a - b)
    },
    filterBy: function (type, value, data) {
      console.log('filter by ' + type + ' ' + value)
      this.gridApi.onFilterChanged(event)
    },
    doesExternalFilterPass: function (node) {
      let pass = (node.data.store === this.filterByStore || this.filterByStore === '') &&
        (node.data.type === this.filterByType || this.filterByType === '') &&
        (node.data.name === this.filterByName || this.filterByName === '')

      return pass
    },
    isExternalFilterPresent: function () {
      console.log('isExternalFilterPresent')
      console.log(this, this.data, this.filterByType, this.filterByName, this.filterByStore)
      return this.filterByType !== '' || this.filterByName !== '' || this.filterByStore !== ''
    }
  },
  filters: {
    byName: (value, name) => {
      let filtered = value.filter((item) => { return item.name === name })
      return filtered
    }
  },
  watch: {
    // work arounds for mdSelect change not firing:
    filterByName: function (val, oldVal) {
      console.log('new val', val, 'old val', oldVal)
      this.filterBy('store', val)
    },
    filterByStore: function (val, oldVal) {
      console.log('new val', val, 'old val', oldVal)
      this.filterBy('store', val)
    },
    filterByType: function (val, oldVal) {
      console.log('new val', val, 'old val', oldVal)
      this.filterBy('store', val)
    }
  },
  components: {
    AgGridVue,
    fullListGrid
  },
  beforeMount () {
    this.columnDefs = [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Type', field: 'type' },
      { headerName: 'Store', field: 'store' },
      {
        headerName: 'Purchase Date',
        field: 'purchaseDate',
        sort: 'desc',
        cellRenderer: function (params) {
          return moment(params.value).format('MMMM Do YYYY, h:mm:ss a')
        }
      },
      {
        headerName: 'Expiration Date',
        field: 'expirationDate',
        cellRenderer: function (params) {
          return moment(params.value).format('MMMM Do YYYY, h:mm:ss a')
        }
      },
      { headerName: 'Quantity', field: 'quantity', width: 125, filter: 'agNumberColumnFilter' }
    ]
    this.columnDefsBucket = [
      { headerName: 'Store', field: 'store', width: 175 },
      {
        headerName: 'Purchase Date',
        field: 'purchaseDate',
        sort: 'desc',
        width: 225,
        cellRenderer: function (params) {
          return moment(params.value).format('MMMM Do YYYY, h:mm:ss a')
        }
      },
      {
        headerName: 'Expiration Date',
        field: 'expirationDate',
        width: 225,
        cellRenderer: function (params) {
          return moment(params.value).format('MMMM Do YYYY, h:mm:ss a')
        }
      },
      { headerName: 'Quantity', field: 'quantity', width: 125, filter: 'agNumberColumnFilter' }
    ]
    this.columnDefsBucketMini = [
      { headerName: 'Store', field: 'store', width: 175 },
      {
        headerName: 'Date',
        field: 'purchaseDate',
        width: 150,
        sort: 'desc',
        cellRenderer: function (params) {
          return moment(params.value).format('ddd, MMM, Do YY, hA')
        }
      },
      {
        headerName: 'Exp Date',
        field: 'expirationDate',
        width: 150,
        cellRenderer: function (params) {
          return moment(params.value).format('ddd, MMM, Do YY, hA')
        }
      },
      { headerName: 'Qty.', field: 'quantity', width: 100, filter: 'agNumberColumnFilter' }
    ]
    this.rowData = []
  },
  created () {
    this.showLoading = false
    /*
    Promise.all([
      axios.get('/static/data/data-9.json')
      // axios.get('/static/data/data-1.json')
      // axios.get('/static/data/data-2.json'),
      // axios.get('/static/data/data-3.json'),
      // axios.get('/static/data/data-4.json'),
      // axios.get('/static/data/data-5.json'),
      // axios.get('/static/data/data-6.json'),
      // axios.get('/static/data/data-7.json'),
      // axios.get('/static/data/data-8.json'),
      // axios.get('/static/data/data-9.json')
    ]).then(([response0]) => {
      let combined = [
        ...response0.data
      ]

      this.showLoading = false

      combined.forEach((item) => {
        let properties = ['store', 'type', 'name']
        let dataProperties = ['foodStores', 'foodTypes', 'foodNames']

        if (item.purchaseDate > item.expirationDate) {
          if (typeof this.foodPurchasedAfterExpiration[item.name] !== 'undefined') {
            this.foodPurchasedAfterExpiration[item.name] += item.quantity
          } else {
            this.foodPurchasedAfterExpiration[item.name] = item.quantity
          }

          this.foodPurchasedAfterExpiration.total += item.quantity
        }

        this.$set(this.showDialog, item.name, false)

        properties.forEach((property, index) => {
          let dataItem = this[dataProperties[index]]

          if (typeof dataItem[item[property]] === 'undefined') {
            dataItem[item[property]] = item.quantity
          } else {
            dataItem[item[property]] += item.quantity
          }
        })
      })

      this.fridge = combined
      this.rowData = combined
    })
    */
  }
}
