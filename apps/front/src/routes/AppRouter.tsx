import Root from '@pages/home/Root'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@pages/general/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
