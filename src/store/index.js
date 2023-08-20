import { createStore } from 'vuex'
import axios from 'axios'
import { consts } from '@/store/consts'
export default createStore({
  state() {
    return {
      nameTitle: '',
      cost: '',
      description: '',
      count: '',
      date: '',
      crossOut: true,
      products: [],
      alert: null,
      loading: false,
      createDate: null,
      valid: false
    }
  },
  mutations: {
    setValue(state, payload) {
      switch (payload.type) {
        case consts.SET_NAME_TITLE: {
          state.nameTitle = payload.value
          break
        }
        case consts.SET_COST: {
          state.cost = payload.value
          break
        }
        case consts.SET_DESCRIPTION: {
          state.description = payload.value

          break
        }
        case consts.SET_COUNT: {
          state.count = payload.value

          break
        }
        case consts.SET_DATE: {
          state.date = payload.value
          break
        }
        case consts.SET_LOADING: {
          state.loading = payload.value
          break
        }
        case consts.CROSS_OUT: {
          state.products.find((item) => item.id === payload.id).crossOut =
            payload.value
          break
        }
        case consts.SET_ALERT: {
          state.alert = payload.value
          break
        }
        default: {
          console.log('Invalid choice')
          break
        }
      }
    },
    setProduct(state, payload) {
      state.nameTitle = payload.nameTitle
      state.cost = payload.cost
      state.description = payload.description
      state.count = payload.count
      state.date = payload.date
      state.crossOut = payload.crossOut
      state.createDate = payload.createDate
    },
    setProductsList(state, payload) {
      state.products.unshift({
        ...payload
      })
    },
    loadingProductsList(state, payload) {
      state.products = Object.keys(payload.value).map((key) => {
        return {
          id: key,
          ...payload.value[key]
        }
      })
    },
    sortProductsList(state) {
      state.products = state.products.sort(function (a, b) {
        return (
          b.crossOut - a.crossOut ||
          Date.parse(b.createDate) - Date.parse(a.createDate)
        )
      })
      console.log(state.products)
    },
    removelocalProduct(state, payload) {
      state.products = state.products.filter((item) => item.id !== payload)
    },
    alertChange(state, payload) {
      state.alert = {
        type: payload.type,
        title: payload.title,
        text: payload.text
      }
    }
  },
  actions: {
    async createProduct(context, payload) {
      let newDate = new Date()
      let response = await axios.post(
        `https://productbase-5ed9c-default-rtdb.firebaseio.com/products.json`,
        {
          nameTitle: payload.nameTitle,
          cost: payload.cost,
          description: payload.description,
          count: payload.count,
          date: payload.date,
          crossOut: payload.crossOut,
          createDate: newDate
        }
      )
      let firebaseDataName = await response.data.name
      context.commit(consts.SET_PRODUCTS_LIST, {
        nameTitle: payload.nameTitle,
        cost: payload.cost,
        description: payload.description,
        count: payload.count,
        date: payload.date,
        crossOut: payload.crossOut,
        id: firebaseDataName,
        createDate: newDate
      })
      context.commit(consts.SET_PRODUCT, {
        nameTitle: '',
        cost: '',
        description: '',
        count: '',
        date: '',
        crossOut: true,
        createDate: null
      })
      context.commit(consts.SORT_PRODUCTS_LIST)
      context.dispatch(consts.GET_ALERT, {
        type: 'primary',
        title: 'Успешно!',
        text: `Товар с названием "${payload.nameTitle}" был добавлен!`
      })
      console.log('createProduct')
    },
    async loadProducts(context) {
      context.commit(consts.SET_VALUE, {
        type: consts.SET_LOADING,
        value: true
      })
      try {
        let { data } = await axios.get(
          'https://productbase-5ed9c-default-rtdb.firebaseio.com/products.json'
        )
        if (!data) {
          throw new Error('Список товаров пуст')
        } else {
          context.commit(consts.LOADING_PRODUCTS_LIST, {
            value: data
          })
          context.commit(consts.SORT_PRODUCTS_LIST)
          context.commit(consts.SET_VALUE, {
            type: consts.SET_LOADING,
            value: false
          })
          console.log('loadProducts')
        }
      } catch (e) {
        context.dispatch(consts.GET_ALERT, {
          type: 'danger',
          title: 'Ошибка!',
          text: e.message
        })
        context.commit(consts.SET_VALUE, {
          type: consts.SET_LOADING,
          value: false
        })
        console.log(e.message)
      }
    },
    async getCrossOutProduct(context, payload) {
      try {
        let str = ' был отмечен на удаление!'
        let nameTitle = payload[2].find(
          (item) => item.id === payload[0]
        ).nameTitle
        await axios.patch(
          `https://productbase-5ed9c-default-rtdb.firebaseio.com/products/${payload[0]}.json`,
          { crossOut: !payload[1] }
        )
        if (payload[1] === false) str = ' был восстановлен!'

        context.commit(consts.SET_VALUE, {
          type: consts.CROSS_OUT,
          value: !payload[1],
          id: payload[0]
        })
        context.commit(consts.SORT_PRODUCTS_LIST)
        console.log('crossOutProduct')
        context.dispatch(consts.GET_ALERT, {
          type: 'primary',
          title: 'Успешно!',
          text: `Товар с названием "${nameTitle}"` + str
        })
      } catch (e) {
        context.dispatch(consts.GET_ALERT, {
          type: 'danger',
          title: 'Ошибка!',
          text: e.message
        })
      }
    },
    async removeProduct(context, payload) {
      try {
        console.log(payload)
        let nameTitle = payload[1].find(
          (item) => item.id === payload[0]
        ).nameTitle
        await axios.delete(
          `https://productbase-5ed9c-default-rtdb.firebaseio.com/products/${payload[0]}.json`
        )
        context.commit(consts.REMOVE_LOCAL_PRODUCT, payload[0])
        context.commit(consts.SORT_PRODUCTS_LIST)
        context.dispatch(consts.GET_ALERT, {
          type: 'primary',
          title: 'Успешно!',
          text: `Товар с названием "${nameTitle}" был удален навсегда!`
        })
        console.log('removeProduct')
      } catch (e) {
        context.dispatch(consts.GET_ALERT, {
          type: 'danger',
          title: 'Ошибка!',
          text: e.message
        })
      }
    },
    getAlert(context, payload) {
      context.commit(consts.ALERT_CHANGE, payload)
      setTimeout(
        () =>
          context.commit(consts.SET_VALUE, {
            type: consts.SET_ALERT,
            value: null
          }),
        1500
      )
    }
  },
  getters: {
    nameTitle(state) {
      return state.nameTitle
    },
    cost(state) {
      return state.cost
    },
    description(state) {
      return state.description
    },
    count(state) {
      return state.count
    },
    date(state) {
      return state.date
    },
    products(state) {
      return state.products
    },
    loading(state) {
      return state.loading
    },
    alert(state) {
      return state.alert
    },
    crossOut(state) {
      return state.crossOut
    },
    createDate(state) {
      return state.createDate
    },
    valid(state) {
      if (
        state.nameTitle !== '' &&
        state.cost !== '' &&
        state.count !== '' &&
        state.description !== '' &&
        state.date !== ''
      )
        return false
      else return true
    }
  }
})
