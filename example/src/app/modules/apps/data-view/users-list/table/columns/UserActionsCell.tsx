/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { ID, KTIcon, QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { deleteUser, getUserById } from '../../core/_requests'
// import { UserEditModalForm } from '../../user-edit-modal/UserEditModalForm'
// // import { UploadForm } from '../../user-edit-modal/UploadForm'
// import { useListViewinUpload } from '../../core/ListViewProviderinUpload'
// import { ProjectEditModalForm } from '../../user-edit-modal/ProjectEditModalForm'

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView()
  const { setIsEdit } = useListView()
  const { Hide, setHide } = useListView()
  // const {setItemIdForUpdateinUpload} = useListViewinUpload()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()


  // const {
  //   isLoading,
  //   data: user,
  //   error,
  // } = useQuery(
  //   `${QUERIES.USERS_LIST}-user-${id}`,
  //   () => {
  //     return getUserById(id)
  //   },
  //   {
  //     cacheTime: 0,

  //     onError: (err) => {
  //       setItemIdForUpdate(undefined)
  //       console.error(err)
  //     },
  //   }
  // )

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
    setIsEdit(true)

  }

  const openUpload = () => {
    // console.log("gcfdthdb");
    setHide(!Hide)
    setIsEdit(false)

    setItemIdForUpdate(id)
    // return <ProjectEditModalForm id={0}  />
  }

  console.log("Hide->", Hide);


  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Actions
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            Edit
          </a>
        </div>
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openUpload}>
            Upload
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async () => await deleteItem.mutateAsync()}
          >
            Delete
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  )
}

export { UserActionsCell }
