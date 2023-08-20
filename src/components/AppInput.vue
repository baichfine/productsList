<template>
  <div :id="item != '' ? 'inputValue' : ''">
    <span id="spanPlaceholder"
      ><Transition name="fade-placeholder"
        ><span v-if="item">{{ placeholder }}</span></Transition
      ></span
    >
    <input
      :type="type"
      :placeholder="placeholder"
      ref="REF"
      :id="item"
      v-model.trim="item"
    /><Transition name="fade-mark"
      ><span v-if="item"><img :src="mark" :alt="mark" /></span
      ><span v-else></span
    ></Transition>
  </div>
</template>

<script setup>
import mark from '../css/svg/mark.svg'
import { useStore } from 'vuex'
import { defineProps, computed, ref } from 'vue'
import { consts } from '@/store/consts'

const props = defineProps({
  type: String,
  placeholder: String,
  const: String,
  value: String
})
const store = useStore()
const REF = ref(null)
const item = computed({
  get() {
    return props.value
  },
  set() {
    store.commit(consts.SET_VALUE, {
      type: props.const,
      value: REF.value.value
    })
  }
})
</script>

<style scoped>
.fade-mark-enter-from,
.fade-mark-leave-to {
  opacity: 0;
  transform: translateX(5px);
}
.fade-mark-enter-to,
.fade-mark-leave-from {
  opacity: 1;
}
.fade-mark-enter-active,
.fade-mark-leave-active {
  transition: all 0.5s ease;
}

.fade-placeholder-enter-from,
.fade-placeholder-leave-to {
  opacity: 0;
  transform: translateX(-55px);
}
.fade-placeholder-enter-to,
.fade-placeholder-leave-from {
  opacity: 1;
}
.fade-placeholder-enter-active,
.fade-placeholder-leave-active {
  transition: all 0.5s ease;
}
</style>
