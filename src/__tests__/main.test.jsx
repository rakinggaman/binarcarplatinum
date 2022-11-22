import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../app/store';

import CarCreate from '../page/CarCreate';
import CarEdit from '../page/CarEdit';
import Cars from '../page/Cars';
import Dashboard from '../page/Dashboard';
import Login from '../page/Login';
import SearchResult from '../page/SearchResult';

import 'cross-fetch/polyfill'

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter >
        {children}
      </BrowserRouter>
    </Provider>
  )
}

test('Render Login page correctly', () => {
  render(
    <Login />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})

test('Render Dashboard page correctly', () => {
  render(
    <Dashboard />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})

test('Render Cars page correctly', () => {
  render(
    <Cars />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})

test('Render CarsEdit page correctly', () => {
  render(
    <CarEdit />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})

test('Render CarCreate page correctly', () => {
  render(
    <CarCreate />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})

test('Render SearchResult page correctly', () => {
  render(
    <SearchResult />
    , { wrapper: AllTheProviders })

  expect(true).toBeTruthy();
})
