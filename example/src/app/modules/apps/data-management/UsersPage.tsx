import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UsersListWrapper } from './users-list/UsersList'
import ViewData from './ViewData'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Data Management',
    path: '/data-management/dataview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='dataview'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Data View</PageTitle>
              {/* <UsersListWrapper /> */}
              <ViewData />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/data-management/dataview' />} />
    </Routes>
  )
}

export default UsersPage
