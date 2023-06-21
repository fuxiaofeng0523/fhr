<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import useStore from './store'
import { diffTokenTime } from '@/utils/token'
const { appStore } = useStore()
appStore.token && diffTokenTime() ? appStore.logout() : null
</script>
