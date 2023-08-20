<template>
  <form class="card" @submit.prevent="createProduct">
    <label class="labelMain"
      >Количество Товаров:
      <span v-if="store.getters.products.length != 0">
        <strong>{{ store.getters.products.length }}</strong></span
      ><span v-else>0</span></label
    >
    <div class="form-control">
      <div>
        <AppInput
          type="text"
          placeholder="Название товара:"
          :const="consts.SET_NAME_TITLE"
          :value="store.getters.nameTitle"
        ></AppInput>
        <AppInput
          type="number"
          placeholder="Стоимость товара:"
          :const="consts.SET_COST"
          :value="store.getters.cost"
        ></AppInput>
        <AppInput
          type="number"
          placeholder="Количество товаров:"
          :const="consts.SET_COUNT"
          :value="store.getters.count"
        ></AppInput>
        <AppInput
          type="date"
          placeholder="Дата:"
          :const="consts.SET_DATE"
          :value="store.getters.date"
        ></AppInput>
        <AppInput
          type="text"
          placeholder="Описание товара:"
          :const="consts.SET_DESCRIPTION"
          :value="store.getters.description"
        ></AppInput>
      </div>
    </div>
    <div class="divBtn">
      <button class="btn" :disabled="store.getters.valid === true">
        Добавить
      </button>
    </div>
  </form>
</template>

<script setup>
import { useStore } from 'vuex'
import { consts } from '@/store/consts'
import AppInput from '@/components/AppInput'

//consts
const store = useStore()
function createProduct() {
  store.dispatch(consts.CREATE_PRODUCT, {
    nameTitle: store.getters.nameTitle,
    cost: store.getters.cost,
    description: store.getters.description,
    count: store.getters.count,
    date: store.getters.date,
    crossOut: store.getters.crossOut,
    createDate: store.getters.createDate
  })
}
</script>
