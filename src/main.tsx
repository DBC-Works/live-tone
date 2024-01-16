import React from 'react'
import { createRoot } from 'react-dom/client'
import { start } from 'tone'

import { App } from '@/views/pages/App'
import './main.css'

//
// entry
//

window.addEventListener('DOMContentLoaded', async () => {
  await start()
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
