/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { ID, KTIcon, QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { deleteUser } from '../../core/_requests'

type Props = {
  id: ID
}

const UserFileOpenCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  return (
    <>
      {/* <a
        href='/catalog-management/documents'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Actions
        <KTIcon iconName='open' className='fs-5 m-0' />
      </a> */}
      {/* begin::Menu */}
      {/* <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      > */}
      <div
        className='btn'
        data-kt-menu='true'
      >
        <button type="button" className="btn btn-sm btn-icon btn-light btn-active-light-primary toggle h-25px w-25px"
          data-kt-docs-datatable-subtable="expand_row">
          <span className="svg-icon fs-3 m-0 toggle-off">...</span>
          <span className="svg-icon fs-3 m-0 toggle-on">...</span>
        </button>
      </div>
      {/* end::Menu */}
    </>
  )
}

export { UserFileOpenCell }
