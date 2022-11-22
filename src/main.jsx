import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import Layout from './components/Layout'

import Login from './page/Login'
import Dashboard from './page/Dashboard'
import Cars from './page/Cars'
import CarCreate from './page/CarCreate'
import CarEdit from "./page/CarEdit"

import './index.scss'

import { store } from './app/store'
import SearchResult from "./page/SearchResult"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cars" element={<Cars />} />
              <Route path="cars/add-car" element={<CarCreate />} />
              <Route path="cars/edit-car/:id" element={<CarEdit />} />
              <Route path="cars/search/:query" element={<SearchResult />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode >
)
