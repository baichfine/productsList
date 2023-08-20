<template>
  <transition name="fade">
    <div v-if="products.length !== 0">
      <transition-group name="list" appear mode="out-in">
        <div
          class="card inline"
          id="list-item"
          v-for="item in products"
          :key="item.id"
        >
          <div>
            <span class="span1"
              ><strong>{{ item.nameTitle }}</strong></span
            >
            <span class="span2">{{ item.cost }} ₽</span>
            <span class="span3">{{ item.count }} шт.</span>
            <span class="span2">{{ newdate(item.date) }}</span
            ><button
              class="btn delete"
              @click="
                item.crossOut === true
                  ? emit('crossOut', [item.id, item.crossOut, products])
                  : emit('remove', [item.id, products])
              "
            >
              <span class="span5"
                >{{ item.crossOut === true ? 'Отметить' : 'Удалить'
                }}<template v-if="item.crossOut"
                  ><img :src="addDelete" :alt="addDelete"
                /></template>
                <template v-else
                  ><img :src="deleteForever" :alt="deleteForever" /></template
              ></span>
            </button>
          </div>
          <div>
            <span class="span4"
              ><strong>Краткое описание: </strong>{{ item.description }}</span
            >
            <button
              class="btn recover"
              v-if="item.crossOut === false"
              @click="emit('crossOut', [item.id, item.crossOut, products])"
            >
              <span class="span5"
                >Отменить <img :src="recover" :alt="recover"
              /></span>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="card center" v-else>
      <h4>Товаров пока нет</h4>
      <button id="loadList" class="btn" @click="emit('load')">
        Загрузить список
      </button>
    </div>
  </transition>
</template>

<script setup>
import addDelete from '../css/svg/addDelete.svg'
import deleteForever from '../css/svg/deleteForever.svg'
import recover from '../css/svg/recover.svg'
import { defineEmits, defineProps } from 'vue'
const emit = defineEmits(['load', 'crossOut', 'remove'])
defineProps({
  products: {}
})
function newdate(dateToChange) {
  console.log(dateToChange)
  const changeDate =
    dateToChange.split('-')[2] +
    '.' +
    dateToChange.split('-')[1] +
    '.' +
    dateToChange.split('-')[0] +
    ' г.'
  return changeDate
}
</script>

<style scoped>
.inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-move {
  transition: transform 1s;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
