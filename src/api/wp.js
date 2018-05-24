import Vue from 'vue'
import VueResource from 'vue-resource'

const API_ROOT = 'http://api.clairefontaine.ws/wp-json/wp/v2/'
const INDEX_ID = 12

Vue.use(VueResource)

Vue.http.options.crossOrigin = true

export default {
  getItems (offset) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item?per_page=10&page=' + offset).then(response => {
        resolve(response)
      }, (response) => {
        reject()
      })
    })
  },
  getAllTexts () {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'text?per_page=100').then(response => {
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  },
  getSingle (id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item/' + id).then(response => {
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  },
  getCollection (id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item/?per_page=100&collection=' + id).then(response => {
        resolve({
          'id': id,
          'posts': response.body
        })
      }, (response) => {
        reject()
      })
    })
  },
  getAllCollections () {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'collection').then(response => {
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  },
  getText (id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'text/' + id).then(response => {
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  },
  getIndex () {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'pages/' + INDEX_ID).then(response => {
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  },
  getSearch (term) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item/?search=' + encodeURI(term) + '&per_page=100').then(response => {
        resolve({'posts': response.body, 'term': term})
      }, (response) => {
        reject()
      })
    })
  },
  getWeather (location) {
    return new Promise((resolve, reject) => {
      Vue.http.get('http://api.openweathermap.org/data/2.5/weather?q=' + encodeURI(location) + '&appid=266ae916c20243f46a521cf3578389f0&units=metric').then(response => {
        console.dir(response.body)
        resolve(response.body)
      }, (response) => {
        reject()
      })
    })
  }
}
