<template>
  <VMain scrollable>
    <VList bg-color="navigation-drawer">
      <VListItem title="Account Balance" subtitle="$ 0"> </VListItem>
    </VList>

    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <VFadeTransition leave-absolute>
          <keep-alive>
            <suspense>
              <component :is="Component" />
            </suspense>
          </keep-alive>
        </VFadeTransition>
      </template>
    </router-view>
  </VMain>
</template>
