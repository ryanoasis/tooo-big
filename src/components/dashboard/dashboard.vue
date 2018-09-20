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
                  <div class="md-title">Complete food Items List</div>
                  <div class="md-subhead">List of all food items with associated properties</div>
                </md-card-header>
                <md-card-content class="md-alignment-center">
                  <full-list-grid />
                </md-card-content>
              </md-card>

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
<script src="./dashboard.js"></script>
<style scoped src="./dashboard.css"></style>
