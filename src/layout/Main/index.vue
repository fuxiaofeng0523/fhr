<template>
  <RouterView v-slot="{ Component, route }">
    <transition :name="String(route.meta.transition)">
      <component
        :is="Component"
        :key="
          route.path.split('/')[1] === 'staffInfo' ? 'staffInfo' : route.path
        " />
    </transition>
  </RouterView>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.slide-left-enter {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-enter-active {
  opacity: 1;
  transform: translateX(0%);
  transition: all 0.3s ease-in-out;
}
.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease-in-out;
}

.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-right-enter-active {
  opacity: 1;
  transform: translateX(0%);
  transition: all 0.3s ease-in-out;
}
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
}
</style>
