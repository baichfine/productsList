<template>
  <Transition name="fade-alert"
    ><div class="alert" v-if="alert" :class="alert.type">
      <h3>{{ alert.title }}</h3>
      <span @click="emit('close')"><img :src="cross" :alt="cross" /></span>
      <p>{{ alert.text }}</p>
    </div>
  </Transition>
</template>

<script setup>
import cross from '../css/svg/cross.svg'
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits(['close'])
defineProps({
  alert: {}
})
</script>

<style scoped>
.fade-alert-enter-from,
.fade-alert-leave-to {
  opacity: 0;
  transform: translateY(-120px);
}
.fade-alert-enter-to,
.fade-alert-leave-from {
  opacity: 1;
}
.fade-alert-enter-active,
.fade-alert-leave-active {
  transition: all 1.5s ease;
}
</style>
