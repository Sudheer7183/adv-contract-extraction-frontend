import React from 'react';
import { useQuery } from 'react-query'
import { UserEditModalForm } from './UserEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getUserById } from '../core/_requests'
import { EditModalForm } from './EditModalForm'

const UserEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        // setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  console.log("User edit Id---->", itemIdForUpdate)

  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{ id: undefined }} />
  }

  console.log("IsLoadingggg --->", isLoading);


  if (itemIdForUpdate) {
    return <EditModalForm id={itemIdForUpdate} />
  }


  return null
}

export { UserEditModalFormWrapper }
