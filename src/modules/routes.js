import generatedRoutes from '~pages'
import { setupLayouts } from 'virtual:generated-layouts'

import { useAppStore } from '@/stores/appStore'

// Progress bar on top of the page.
// Customize styles in @/styles/_progress-bar.css
import NProgress from 'nprogress'

// Changes based on build mode ( '' || github)
const baseRoute = import.meta.env.VITE_BASE_ROUTE

const router = createRouter({
  history: createWebHistory(baseRoute),
  routes: setupLayouts(generatedRoutes),
})

router.beforeEach(async (to, from, next) => {
  if (to.path !== from.path) {
    // Calling useAppStore inside guards
    // to avoid getting `pinia not being instanciated` error.
    const store = useAppStore()
    //Avoids button flickering on fast routing.
    setTimeout(() => {
      store.isRouting = true
    }, 600)
    NProgress.start()
  }

  const isAuth = await getUserState()
  const atLoginAndAuthenticated = to.matched.some(
    r => r.path === '/login' && isAuth
  )
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  // If the route requires the user to be authenticated and it is not,
  // route to the login page.
  if (requiresAuth && !isAuth) {
    next({ path: '/login' })
    return
  }

  // If the user navigates to the login page and it's already authenticated,
  // route to the profile page instead.
  if (atLoginAndAuthenticated) {
    next({ path: '/account/overview' })
    return
  }

  next()
})

router.afterEach(() => {
  // Calling useAppStore inside guards
  // to avoid getting `pinia not being instanciated` error.
  const store = useAppStore()
  //Avoids button flickering on fast routing.
  setTimeout(() => {
    store.isRouting = false
  }, 600)

  NProgress.done()
})

const install = app => app.use(router)

// Exporting router so Pinia can import it
// 👉 allowing router in store modules.
export { install, router }
