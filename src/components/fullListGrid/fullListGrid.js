import api from '../../services/api.js'
import moment from 'moment'

export default {
  data () {
    return {
      dateFormat: 'MMMM Do, YYYY @ h:mm:ss a',
      dataBucket: -1, // which 'bucket' of data from API to fetch from
      headers: [
        { text: 'Name', value: 'name', align: 'left' },
        { text: 'Type', value: 'type', align: 'left' },
        { text: 'Store', value: 'store', align: 'left' },
        { text: 'Purchase Date', value: 'purchaseDate', align: 'left' },
        { text: 'Expiration Date', value: 'expirationDate', align: 'left' },
        { text: 'Status', align: 'center', sortable: false },
        { text: 'Quantity', value: 'quantity', align: 'right' }
      ],
      search: '',
      isLoading: false,
      items: [],
      allItems: [],
      totalItems: 50000, // assumption
      currentTotalItems: 0,
      rowsPerPageItems: [5, 10, 25, 100, 1000, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      pagination: { sortBy: 'purchaseDate', descending: true, rowsPerPage: 100 },
      filterableProperties: ['store', 'type', 'name'],
      filterableCollections: ['foodStores', 'foodTypes', 'foodNames'],
      filterByStore: '',
      filterByType: '',
      filterByName: '',
      foodStores: {},
      foodTypes: {},
      foodNames: {}
    }
  },
  created () {
    // api.getDataSet(0)
    //  .then(this.setGridDataSource)

    // private methods

    this.filterMetricByValue = function (data, metric, value) {
      return data.filter((item) => {
        return item[metric] === value
      })
    }

    // @todo refactor?
    /* (node.data.store === this.filterByStore || this.filterByStore === '') &&
    (node.data.type === this.filterByType || this.filterByType === '') &&
    (node.data.name === this.filterByName || this.filterByName === '') */
    this.filterByDropDown = function (val, oldVal, metric) {
      console.log('new val', val, 'old val', oldVal)
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.allItems = this.cachedItems.filter(this.filterItem, this)
      this.items = this.cachedItems.filter(this.filterItem, this).slice((page - 1) * rowsPerPage, page * rowsPerPage)
    }

    this.filterItem = function (item) {
      return (item.store === this.filterByStore || this.filterByStore === '') &&
      (item.type === this.filterByType || this.filterByType === '') &&
      (item.name === this.filterByName || this.filterByName === '')
    }

    this.updateFilterOptions = function (rawData, properties, filterCollections) {
      const module = this
      rawData.forEach((item) => {
        properties.forEach((property, index) => {
          let collection = module[filterCollections[index]]
          let isExpired = item.purchaseDate > item.expirationDate
          if (!collection[item[property]]) {
            collection[item[property]] = {
              total: item.quantity
            }
            if (isExpired) {
              collection[item[property]].expired = item.quantity
            }
          } else {
            collection[item[property]].total += item.quantity
            if (isExpired) {
              collection[item[property]].expired += item.quantity
            }
          }
        })
      })
    }

    this.setGridDataSource = function (data) {
      console.log('pagination', this.pagination)
      const { sortBy, descending, page, rowsPerPage } = this.pagination

      // update the filter drop downs with any new items
      this.updateFilterOptions(data, this.filterableProperties, this.filterableCollections)

      this.$emit('foodStoresUpdated', this.foodStores)
      this.$emit('foodTypesUpdated', this.foodTypes)
      this.$emit('foodNamesUpdated', this.foodNames)

      if (this.filterByName !== '') {
        data = this.filterMetricByValue(data, 'name', this.filterByName)
        // reset all items
        this.allItems = []
      }

      if (this.filterByType !== '') {
        data = this.filterMetricByValue(data, 'type', this.filterByType)
        // reset all items
        this.allItems = []
      }

      if (this.filterByStore !== '') {
        data = this.filterMetricByValue(data, 'store', this.filterByStore)
        // reset all items
        this.allItems = []
      }

      // this.totalItems = data.length
      this.currentTotalItems = data.length
      this.items = data
      this.allItems = [...this.allItems, ...this.items]
      this.cachedItems = this.allItems

      if (this.pagination.sortBy) {
        this.items = this.items.sort(this.comparator)
      }

      if (rowsPerPage > 0) {
        this.items = this.allItems.slice((page - 1) * rowsPerPage, page * rowsPerPage)
      }
    }
  },
  watch: {
    pagination: {
      handler (event) {
        let { page, rowsPerPage } = this.pagination

        // determine if we can paginate through data or need to fetch more from API
        if (page && rowsPerPage && (page * rowsPerPage > this.allItems.length)) {
          let apiPage = ++this.dataBucket // (event.rowsPerPage / (event.page * event.rowsPerPage)) - 1
          console.log('no more data in this block - time to hit the API')
          this.isLoading = true
          api.getDataSet(apiPage)
            .then(this.setGridDataSource.bind(this))
            .then(() => {
              this.isLoading = false
            })
        } else if (rowsPerPage > 0) {
          console.log('slice and dice the data we have')
          this.items = this.allItems.sort(this.comparator).slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }
      },
      deep: true
    },
    filterByName: function (val, oldVal) {
      this.filterByDropDown(val, oldVal, 'name')
    },
    filterByStore: function (val, oldVal) {
      this.filterByDropDown(val, oldVal, 'store')
    },
    filterByType: function (val, oldVal) {
      this.filterByDropDown(val, oldVal, 'type')
    }
  },
  mounted () {
  },
  methods: {
    moment: function (value) {
      return moment(value)
    },
    comparator: function (a, b) {
      const { sortBy, descending } = this.pagination
      const sortA = a[sortBy]
      const sortB = b[sortBy]

      if (descending) {
        if (sortA < sortB) return 1
        if (sortA > sortB) return -1
        return 0
      } else {
        if (sortA < sortB) return -1
        if (sortA > sortB) return 1
        return 0
      }
    },
    customFilter: function (items, search, filter) {
      console.log('customFilter', items, search, filter)
      search = search.toString().toLowerCase()
      return items.filter(row => filter(row['type'], search))
    },
    customSort: function (items, index, isDescending) {
      console.log('custom sort', items, index, isDescending)
      this.pagination.descending = isDescending
      return items.sort(this.comparator)
    }
  }
}
