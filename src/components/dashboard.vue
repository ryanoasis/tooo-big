<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">{{ title }}</span>
      </md-app-toolbar>
      <md-app-content>
        <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" v-show="showLoading"></md-progress-spinner>
          <div v-bind:class="{ loading: showLoading }">
            <div class="md-layout md-alignment-center">
              <div class="md-layout-item md-size-100">
                <md-card>
                  <md-card-header>
                    <div class="md-title">
                      <md-badge :md-content="foodPurchasedAfterExpiration.total">
                        <md-button class="md-icon-button">
                          <md-icon>notifications</md-icon>
                          <md-tooltip md-direction="top">{{ foodPurchasedAfterExpiration.total }} total item(s) were purchased after expiration</md-tooltip>
                        </md-button>
                      </md-badge>
                      Quantity of food
                    </div>
                    <div class="md-subhead">Quantity of food purchased after expiration: {{ foodPurchasedAfterExpiration.total }}</div>
                  </md-card-header>
                </md-card>
              </div>
              <!-- Buckets -->
              <div v-for="(item, key) in foodNames" :key="key" class="card-expansion md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <md-card>
                  <md-card-header>
                    <div class="md-title">
                      <md-badge :md-content="foodPurchasedAfterExpiration[key]">
                        <md-button class="md-icon-button">
                          <md-icon>notifications</md-icon>
                          <md-tooltip md-direction="top">{{ foodPurchasedAfterExpiration[key] }} {{ key }} item(s) were purchased after expiration</md-tooltip>
                        </md-button>
                      </md-badge>
                      {{ key }} bucket
                    </div>
                    <div class="md-subhead">Quantity of {{ key }} by date purchased</div>
                  </md-card-header>
                  <md-card-expand>
                    <md-card-actions md-alignment="space-between">
                      <div>
                        <!-- <md-button>Details</md-button> -->
                        key is {{ key }} and showDialog[key] is {{ showDialog[key] }}<br/>
                        <!-- v-on:click="showDialog[key] = true" -->
                        <!-- @click="openDialog('dialog' + key)" -->
                        <md-button v-on:click="showDialog[key] = true" :md-ripple="false"><md-icon>launch</md-icon> Details</md-button>
                      </div>

                      <md-card-expand-trigger>
                        <md-button class="md-icon-button">
                          <md-icon>keyboard_arrow_down</md-icon>
                        </md-button>
                      </md-card-expand-trigger>
                    </md-card-actions>

                    <md-card-expand-content>
                      <md-card-content>
                        <ag-grid-vue style="width: 100%; height: 300px;"
                          class="ag-theme-material md-scrollbar"
                          :columnDefs="columnDefsBucketMini"
                          :rowData="rowData | byName(key)"
                          :enableSorting="true"
                          :enableFilter="true">
                        </ag-grid-vue>
                      </md-card-content>
                    </md-card-expand-content>
                  </md-card-expand>
                </md-card>
                <!-- :md-active.sync="showDialog.key"  -->
                <!-- v-bind:md-active.sync="'showDialog' + key" -->
                <!-- :ref="'dialog' + key" -->
                <md-dialog v-bind:md-active.sync="showDialog[key]">
                  <md-dialog-title>{{ key }}</md-dialog-title>
                  <ag-grid-vue style="width: 100%; height: 300px;"
                          class="ag-theme-material md-scrollbar"
                          :columnDefs="columnDefsBucket"
                          :rowData="rowData | byName(key)"
                          :enableSorting="true"
                          :enableFilter="true">
                        </ag-grid-vue>
                  <md-dialog-actions>
                    <!-- @click="showDialog[key] = false" -->
                    <!-- @click="showDialog[key] = false" -->
                    <!-- v-on:click="showDialog[key] = false" -->
                    <!--  @click="closeDialog('dialog' + key)" -->
                    <md-button class="md-primary" @click="showDialog[key] = false">Close</md-button>
                  </md-dialog-actions>
                </md-dialog>
              </div>
            </div>
            <md-card md-with-hover>
              <md-card-header>
                <div class="md-title">Complete food Items List</div>
                <div class="md-subhead">List of all food items with associated properties</div>
              </md-card-header>
              <md-card-content class="md-layout md-gutter md-alignment-center">
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="foodName">Filter by Name</label>
                    <!-- @click="filterBy('type', filterByName)" -->
                    <md-select name="foodName" v-model="filterByName" :md-ripple="false">
                      <md-option value="">All</md-option>
                      <md-option v-for="(item, key) in sortedAsArray(foodNames)" :key="key" :value="item">
                        {{ item }}
                      </md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="foodStore">Filter by Store</label>
                    <!-- @change="filterBy('type', filterByStore)" -->
                    <md-select name="foodStore" v-model="filterByStore" :md-ripple="false">
                      <md-option value="">All</md-option>
                      <md-option v-for="(item, key) in sortedAsArray(foodStores)" :key="key" :value="item">
                        {{ item }}
                      </md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="foodType">Filter by Type</label>
                    <!-- v-on:change="filterBy('type', filterByType)" -->
                    <md-select name="foodType" v-model="filterByType" :md-ripple="false">
                      <md-option value="">All</md-option>
                      <md-option v-for="(item, key) in sortedAsArray(foodTypes)" :key="key" :value="item">
                        {{ item }}
                      </md-option>
                    </md-select>
                  </md-field>
                </div>
                <ag-grid-vue style="width: 95%; height: 500px;"
                  class="ag-theme-material md-scrollbar"
                  :columnDefs="columnDefs"
                  :rowData="rowData"
                  :enableSorting="true"
                  :enableFilter="true"
                  :isExternalFilterPresent="isExternalFilterPresent.bind(this)"
                  :doesExternalFilterPass="doesExternalFilterPass.bind(this)"
                  :gridReady="onGridReady">
                </ag-grid-vue>
              </md-card-content>
            </md-card>
          </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data () {
    return {
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
    AgGridVue
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
    Promise.all([
      axios.get('/static/data/data-0.json'),
      axios.get('/static/data/data-1.json'),
      axios.get('/static/data/data-2.json'),
      axios.get('/static/data/data-3.json'),
      axios.get('/static/data/data-4.json'),
      axios.get('/static/data/data-5.json'),
      axios.get('/static/data/data-6.json'),
      axios.get('/static/data/data-7.json'),
      axios.get('/static/data/data-8.json'),
      axios.get('/static/data/data-9.json')
    ]).then(([response0, response1, response2, response3, response4, response5, response6, response7, response8, response9]) => {
      let combined = [
        ...response0.data,
        ...response1.data,
        ...response2.data,
        ...response3.data,
        ...response4.data,
        ...response5.data,
        ...response6.data,
        ...response7.data,
        ...response8.data,
        ...response9.data
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
      console.log(this.showDialog)
    })

    console.log(this.showDialog)

    // fetch('/static/data/data-0.json')
    //   .then(response => response.json())
    //   .then(json => {
    //     json.forEach((item) => {
    //       let properties = ['store', 'type', 'name']
    //       let dataProperties = ['foodStores', 'foodTypes', 'foodNames']

    //       if (item.purchaseDate > item.expirationDate) {
    //         if (typeof this.foodPurchasedAfterExpiration[item.name] !== 'undefined') {
    //           this.foodPurchasedAfterExpiration[item.name] += item.quantity
    //         } else {
    //           this.foodPurchasedAfterExpiration[item.name] = item.quantity
    //         }

    //         this.foodPurchasedAfterExpiration.total += item.quantity
    //       }

    //       properties.forEach((property, index) => {
    //         let dataItem = this[dataProperties[index]]

    //         if (typeof dataItem[item[property]] === 'undefined') {
    //           dataItem[item[property]] = item.quantity
    //         } else {
    //           dataItem[item[property]] += item.quantity
    //         }
    //       })
    //     })

    //     // console.log(this.foodStores, this.foodTypes, this.foodNames, this.foodPurchasedAfterExpiration)

    //     this.fridge = json
    //     this.rowData = json
    //   })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.md-card {
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.md-dialog {
  width: 768px;
}
.md-progress-spinner {
  position: relative;
  z-index: 9;
  top: 300px;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
}
.loading {
  opacity: .5;
  filter: blur(3px);
}
</style>
