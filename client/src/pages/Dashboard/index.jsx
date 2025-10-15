import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Add from './Add'
import All from './All'

const Dashboard = () => {
  return (
  <Routes>
    <Route path='add' element={<Add />} />
    <Route path='all' element={<All />} />
  </Routes>
  )
}

export default Dashboard