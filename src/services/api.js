import axios from 'axios'

const getDataSet = function (dataSet) {
  return axios.get('/static/data/data-' + dataSet + '.json')
    .then(response => {
      return response.data
    })
}

export default {
  getDataSet: getDataSet
}
