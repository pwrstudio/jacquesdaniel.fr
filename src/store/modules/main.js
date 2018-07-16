import api from '../../api/wp'
import * as actionTypes from '../actionTypes'
import * as mutationTypes from '../mutationTypes'

const state = {
  items: [],
  text: {},
  texts: [],
  collection: {},
  collections: [],
  index: {},
  search: {},
  filter: 0,
  busy: false,
  searchTerm: '',
  horizontal: {
    parent: '',
    context: {},
    index: 0
  },
  loaded: {
    items: false,
    collection: false,
    single: false,
    text: false,
    texts: false,
    index: false,
    search: false,
    share: false
  },
  offset: 1,
  collectionEntry: 0
}

const actions = {
  async [actionTypes.GET_ITEMS]({commit, state}) {
    commit(mutationTypes.SET_ITEMS, await api.getItems(state.offset))
  },
  async [actionTypes.GET_SINGLE]({commit, state}, id) {
    commit(mutationTypes.SET_SINGLE, await api.getSingle(id))
  },
  async [actionTypes.GET_ALL_TEXTS]({commit, state}, id) {
    commit(mutationTypes.SET_ALL_TEXTS, await api.getAllTexts())
  },
  [actionTypes.CHANGE_SINGLE]({commit, state}, newItem) {
    commit(mutationTypes.SET_SINGLE, newItem)
  },
  async [actionTypes.GET_INDEX]({commit, state}) {
    commit(mutationTypes.SET_INDEX, await api.getIndex())
  },
  async [actionTypes.GET_COLLECTION]({commit, state}, id) {
    commit(mutationTypes.SET_COLLECTION, await api.getCollection(id))
  },
  async [actionTypes.GET_COLLECTIONS]({commit, state}) {
    commit(mutationTypes.SET_COLLECTIONS, await api.getAllCollections())
  },
  async [actionTypes.GET_SEARCH]({commit, state}, term) {
    commit(mutationTypes.SET_SEARCH, await api.getSearch(term))
  },
  [actionTypes.RESET_SINGLE_ITEM]({commit, state}) {
    commit(mutationTypes.RESET_SINGLE_ITEM)
  },
  [actionTypes.RESET_COLLECTION]({commit, state}) {
    commit(mutationTypes.RESET_COLLECTION)
  },
  [actionTypes.RESET_SEARCH]({commit, state}) {
    commit(mutationTypes.RESET_SEARCH)
  },
  [actionTypes.HIDE_TEXT]({commit, state}) {
    commit(mutationTypes.HIDE_TEXT)
  },
  [actionTypes.SHOW_TEXT]({commit, state}, id) {
    let newText = state.texts.find(text => {
      return Number(text.id) === Number(id)
    })
    if (newText) {
      commit(mutationTypes.SHOW_TEXT, newText)
    }
  },
  [actionTypes.SET_CONTEXT]({commit, state}, arg) {
    commit(mutationTypes.SET_CONTEXT, arg)
  },
  [actionTypes.SET_N]({commit, state}, data) {
    commit(mutationTypes.SET_N, data)
  },
  [actionTypes.SET_BUSY]({commit, state}) {
    commit(mutationTypes.SET_BUSY)
  },
  [actionTypes.SET_FILTER]({commit, state}, id) {
    commit(mutationTypes.SET_FILTER, id)
  },
  [actionTypes.HIDE_SHARE]({commit, state}) {
    commit(mutationTypes.HIDE_SHARE)
  },
  [actionTypes.SHOW_SHARE]({commit, state}) {
    commit(mutationTypes.SHOW_SHARE)
  },
  [actionTypes.SET_COLLECTION_ENTRY]({commit, state}, data) {
    commit(mutationTypes.SET_COLLECTION_ENTRY, data)
  }
}

const mutations = {
  [mutationTypes.SET_ITEMS](state, data) {
    state.items.push.apply(state.items, data.body)
    state.loaded.items = true
    // console.dir(data.headers)
    if (data.headers.map['x-wp-totalpages']) {
      state.pages = data.headers.map['x-wp-totalpages'][0]
    } else {
      state.pages = data.headers.map['X-WP-TotalPages'][0]
    }
    state.offset = state.offset + 1
  },
  [mutationTypes.SET_ALL_TEXTS](state, data) {
    state.texts.push.apply(state.texts, data)
    state.loaded.texts = true
  },
  [mutationTypes.SET_SINGLE](state, data) {
    state.single = data
    state.loaded.single = true
  },
  [mutationTypes.SET_COLLECTIONS](state, data) {
    state.collections = data
  },
  [mutationTypes.SET_INDEX](state, data) {
    state.index = data
    state.loaded.index = true
  },
  [mutationTypes.SET_COLLECTION](state, data) {
    state.collectionId = data.id
    state.collection = data.posts
    state.loaded.collection = true
  },
  [mutationTypes.SET_SEARCH](state, data) {
    state.search = data.posts
    state.searchTerm = data.term
    state.loaded.search = true
  },
  [mutationTypes.RESET_SINGLE_ITEM](state) {
    // console.log('RESET')
    state.single = {}
    state.loaded.single = false
  },
  [mutationTypes.RESET_COLLECTION](state) {
    state.collection = {}
    state.loaded.collection = false
  },
  [mutationTypes.RESET_SEARCH](state) {
    state.search = {}
    state.searchTerm = ''
    state.loaded.search = false
  },
  [mutationTypes.HIDE_TEXT](state) {
    state.text = {}
    state.loaded.text = false
  },
  [mutationTypes.SHOW_TEXT](state, data) {
    state.text = data
    state.loaded.text = true
  },
  [mutationTypes.SET_CONTEXT](state, arg) {
    state.horizontal.context = arg.data
    state.horizontal.parent = arg.parent
  },
  [mutationTypes.SET_N](state, data) {
    state.horizontal.index = data
  },
  [mutationTypes.SET_BUSY](state) {
    state.busy = true
  },
  [mutationTypes.HIDE_SHARE](state) {
    state.loaded.share = false
  },
  [mutationTypes.SHOW_SHARE](state) {
    state.loaded.share = true
  },
  [mutationTypes.SET_COLLECTION_ENTRY](state, data) {
    state.collectionEntry = data
  },
  [mutationTypes.SET_FILTER](state, id) {
    state.filter = id
  }
}

export default {
  state,
  actions,
  mutations
}
