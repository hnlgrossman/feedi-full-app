<template>
  <!-- <transition name="fade" mode="out-in">
    <router-view/>
  </transition> -->

  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss">
</style>
