import Vue from 'vue'
import VueResource from 'vue-resource'

// const API_ROOT = 'http://localhost/wp-json/wp/v2/'
// const API_ROOT = 'https://wordpress.jacquesdaniel.fr/wp-json/wp/v2/'
// const API_ROOT = 'http://jd-wp.benediktreichenbach.com/wp-json/wp/v2/'
const API_ROOT =
  'https://api.jacquesdaniel.benediktreichenbach.com/wp-json/wp/v2/'
const INDEX_ID = 12

Vue.use(VueResource)

Vue.http.options.crossOrigin = true

export default {
  getItems(offset) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item?per_page=10&page=' + offset).then(
        response => {
          resolve(response)
        },
        response => {
          reject()
        }
      )
    })
  },
  getAllTexts() {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'text?per_page=100').then(
        response => {
          resolve(response.body)
        },
        response => {
          reject()
        }
      )
    })
  },
  getSingle(id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item/' + id).then(
        response => {
          resolve(response.body)
        },
        response => {
          reject()
        }
      )
    })
  },
  getCollection(id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'item/?per_page=100&collection=' + id).then(
        response => {
          resolve({
            id: id,
            posts: response.body,
          })
        },
        response => {
          reject()
        }
      )
    })
  },
  getAllCollections() {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'collection').then(
        response => {
          resolve(response.body)
        },
        response => {
          reject()
        }
      )
    })
  },
  getText(id) {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'text/' + id).then(
        response => {
          resolve(response.body)
        },
        response => {
          reject()
        }
      )
    })
  },
  getIndex() {
    return new Promise((resolve, reject) => {
      Vue.http.get(API_ROOT + 'pages/' + INDEX_ID).then(
        response => {
          resolve(response.body)
        },
        response => {
          reject()
        }
      )
    })
  },
  getSearch(term) {
    return new Promise((resolve, reject) => {
      Vue.http
        .get(API_ROOT + 'item/?search=' + encodeURI(term) + '&per_page=100')
        .then(
          response => {
            resolve({ posts: response.body, term: term })
          },
          response => {
            reject()
          }
        )
    })
  },
}
