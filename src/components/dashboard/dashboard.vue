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
                  <div class="md-title">Expirations by Store</div>
                  <div class="md-subhead">Breakdown of total expirations by store</div>
                </md-card-header>
                <md-card-content class="md-alignment-center">
                  <bucket-chart :dataSource1="mapValues(foodStores, function(o) { return o.expired })" :dataSource2="mapValues(foodStores, function(o) { return o.total })" />
                </md-card-content>
              </md-card>
              <md-card>
                <md-card-header>
                  <div class="md-title">Expirations by Type</div>
                  <div class="md-subhead">Breakdown of total expirations by type</div>
                </md-card-header>
                <md-card-content class="md-alignment-center">
                  <bucket-chart :dataSource1="mapValues(foodTypes, function(o) { return o.expired })" :dataSource2="mapValues(foodTypes, function(o) { return o.total })" />
                </md-card-content>
              </md-card>
              <!-- @todo ? -->
              <!--
              <md-card>
                <md-card-header>
                  <div class="md-title">Expirations by Store Heat Map</div>
                  <div class="md-subhead">Breakdown of total expirations by store</div>
                </md-card-header>
                <md-card-content class="md-alignment-center">
                  <expiration-heat-map-chart :dataSource="foodStores" />
                </md-card-content>
              </md-card>
              -->
              <md-card>
                <md-card-header>
                  <div class="md-title">Complete food Items List</div>
                  <div class="md-subhead">List of all food items with associated properties</div>
                </md-card-header>
                <md-card-content class="md-alignment-center">
                  <full-list-grid @foodStoresUpdated="onFoodStoresUpdated" @foodTypesUpdated="onFoodTypesUpdated" @foodNamesUpdated="onFoodNamesUpdated" />
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>
<script src="./dashboard.js"></script>
<style scoped src="./dashboard.css"></style>
