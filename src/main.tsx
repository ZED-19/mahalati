import '@fontsource/cairo/700.css'
import '@fontsource/cairo/800.css'
import '@fontsource/cairo/900.css'
import '@fontsource/tajawal/400.css'
import '@fontsource/tajawal/500.css'
import '@fontsource/tajawal/700.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { registerSW } from 'virtual:pwa-register'
import { Shell, TabsLayout } from './components/Layout'
import { Favorites, Home, MapScreen, MyQuestions } from './pages/customer'
import { Inbox, OwnerHome, SettingsScreen } from './pages/owner'
import { AskScreen, ShopPage } from './pages/shop'
import { useStore } from './store'

registerSW({
  immediate: true,
  onOfflineReady: () => useStore.getState().toast('محلاتي جاهز للعمل بدون إنترنت'),
})

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      {
        element: <TabsLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/map', element: <MapScreen /> },
          { path: '/favorites', element: <Favorites /> },
          { path: '/questions', element: <MyQuestions /> },
          { path: '/owner', element: <OwnerHome /> },
          { path: '/owner/inbox', element: <Inbox /> },
          { path: '/settings', element: <SettingsScreen /> },
        ],
      },
      { path: '/shop/:id', element: <ShopPage /> },
      { path: '/shop/:id/ask', element: <AskScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
