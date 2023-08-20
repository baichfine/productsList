<template>
  <div class="container">
    <AppAlert :alert="alert" @close="closeAlert"></AppAlert>
    <AppCreateProduct></AppCreateProduct>
    <AppLoader v-if="loading"></AppLoader>
    <AppProductList
      v-else
      @load="loadProducts"
      @crossOut="getCrossOutProduct"
      @remove="removeProduct"
      :products="products"
    ></AppProductList>
  </div>
</template>

<script setup>
import AppProductList from './components/AppProductList.vue'
import AppLoader from './components/AppLoader.vue'
import AppAlert from './components/AppAlert.vue'
import AppCreateProduct from '@/components/AppCreateProduct'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { consts } from '@/store/consts'

const store = useStore()

const loading = computed(() => store.getters.loading)
const products = computed(() => store.getters.products)
const alert = computed(() => store.getters.alert)

onMounted(() => {
  loadProducts()
})
function getCrossOutProduct(item) {
  store.dispatch(consts.GET_CROSS_OUT_PRODUCT, item)
}
function removeProduct(item) {
  store.dispatch(consts.REMOVE_PRODUCT, item)
}
function loadProducts() {
  store.dispatch(consts.LOAD_PRODUCTS)
}
function closeAlert() {
  store.commit(consts.SET_VALUE, {
    type: consts.SET_ALERT,
    value: null
  })
}
</script>
