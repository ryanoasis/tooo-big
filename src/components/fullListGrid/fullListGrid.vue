<template>
  <v-card>
    <v-card-title>
      <v-select
        label="Filter by Name"
        :items="Object.keys(foodNames).sort()"
        v-model="filterByName"
      ></v-select>
      <v-spacer></v-spacer>
      <v-select
        label="Filter by Store"
        :items="Object.keys(foodStores).sort()"
        v-model="filterByStore"
      ></v-select>
      <v-spacer></v-spacer>
      <v-select
        label="Filter by Type"
        :items="Object.keys(foodTypes).sort()"
        v-model="filterByType"
      ></v-select>
      <!--
      <div class="md-layout-item md-size-33">
        <md-field>
          <label for="foodName">Filter by Name</label>
          <md-select name="foodName" v-model="filterByName" :md-ripple="false">
            <md-option value="">All</md-option>
            <md-option value="Turnips">Turnips</md-option>
          </md-select>
        </md-field>
      </div>
      -->
      <!-- <v-select
        label="Filter by Name"
        :items="['Turnips', 'Butter', 'Pepper']"
        v-model="search"
      ></v-select> -->
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field> -->
    </v-card-title>
    <!-- @todo fix search prop ':search="search"' search will not work when using 'total-items' (server side fetching) -->
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      :custom-filter="customFilter"
      :total-items="totalItems"
      :loading="isLoading"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.store }}</td>
        <td class="text-xs-left">{{ moment(props.item.purchaseDate).format(dateFormat) }}</td>
        <td class="text-xs-left">{{ moment(props.item.expirationDate).format(dateFormat) }}</td>
        <td class="text-xs-center">
          <v-chip color="error" text-color="white" v-if="props.item.expirationDate > props.item.purchaseDate">
            <v-avatar>
              <v-icon>warning</v-icon>
            </v-avatar>
            Expired
            <md-tooltip md-direction="right">Expired before purchase</md-tooltip>
          </v-chip>
          <v-chip color="teal" text-color="white" v-else>
            <v-avatar>
              <v-icon>check_circle</v-icon>
            </v-avatar>
            Okay
            <md-tooltip md-direction="right">Okay</md-tooltip>
          </v-chip>
          <!-- {{ props.item.expirationDate > props.item.purchaseDate ? 'ouch' : 'no prob' }} -->
        </td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
      </template>
      <v-alert slot="no-results" :value="true" color="primary" icon="info" v-if="isLoading">
        Loading ...
      </v-alert>
      <v-alert slot="no-results" :value="true" color="error" icon="warning" v-else>
        No results found.
      </v-alert>
    </v-data-table>
  </v-card>
</template>
<script src="./fullListGrid.js"></script>
<style scoped src="./fullListGrid.css"></style>
