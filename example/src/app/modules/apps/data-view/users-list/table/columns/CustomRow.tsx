// @ts-nocheck
import clsx from 'clsx'
import React, { FC } from 'react'
import { Row } from 'react-table'
import { User } from '../../core/_models'
import { useListView } from '../../core/ListViewProvider'
import DataView1 from '../../../DataView'


type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({ row }) => {
  const { Expand } = useListView()
  console.log("rowss", row);

  return (
    <>
      <tr  {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return (
            <td
              {...cell.getCellProps()}
              className={clsx({ 'text-end min-w-100px': cell.column.id === 'actions' })}
            >
              {cell.render('Cell')}
            </td>
          )
        })}

      </tr>
      <tr tr {...row.getRowProps()}>
        {
          row.original.node.id === Expand ? (
            <>
              <td colspan="4">

                <DataView1
                  pname={row.original.node.project.projectName}
                  fname={row.original.node.fileName}
                />
              </td>
            </>
          ) : null
        }

      </tr >
    </>

  )
}

export { CustomRow }
