import React, { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn'
import { CustomRow } from '../table/columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { Projects, User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody, createResponseContext, initialQueryResponse } from '../../../../../../_metronic/helpers'
import { request, gql } from 'graphql-request'
// import _ from 'lodash'
import { useListView } from '../core/ListViewProvider'
import { useAuth } from '../../../../auth'
import BASEURL from '../../../../../config/baseurl'
// import { useQuery } from 'react-query'




const ASSIGNED_PROJECTS = gql`
query assignProjectUserid($id: String!){
  assignProjectUserid(id: $id){
    edges{
      node{
        id
        project{
          id
          projectName
          totalFiles
        }
      }
    }  
  }
}`

const USER_DATAVIEW = gql`
query userDataviewDetail($role: String!, $projects: [ProjectsInput]!, $skip:Int!, $first:Int!){
  userDataviewDetail(value: $role, projects: $projects, skip:$skip, first:$first){
    edges{
      node{
        id
        project{
          id
          projectName
        }
        fileName
        doctype
        title
        effectiveDate
        expirationDate
        parties
        venue
        governingLaw
        paymentMethod
        paymentDueDates  
      }
    }
  }
}`

const UsersTable = () => {
  const { currentUser } = useAuth()
  const { Expand } = useListView()
  const columns = useMemo(() => usersColumns, [])
  const [data1, setData1] = useState<any[]>([])

  // const [user_dataview, setUser_dataview] = useState<any[]>([])
  const [project, setProject] = useState<any[]>([])
  // const [projects, setProjects] = useState<any[]>([])
  const [data, setdata] = useState<any[]>([]);

  const [skip, setSkip] = useState(0);
  const [first, setFrist] = useState(2);

  const Id: any = currentUser?.id
  const Role: any = currentUser?.role

  useEffect(() => {
    console.log("role-->", Role);
    request(`${BASEURL}graphql/`, ASSIGNED_PROJECTS, { id: Id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
      // setProjects(data)
      const lenn = data.assignProjectUserid?.edges.length

      for (let i = 0; i < lenn; i++) {
        const pn = data.assignProjectUserid?.edges[i]?.node?.project.projectName
        data1.push(pn);
      }
      const len = data1.length
      if (len > 0) {
        for (let j = 0; j < len; j++) {
          let proName = data1[j]
          project.push({ projectName: proName })
          console.log("project-->", project)
          // setProject(project)
        }
      }
      console.log("outside if project-->", project)
      request(`${BASEURL}graphql/`, USER_DATAVIEW, { role: Role, projects: project, skip: skip, first: first }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setdata(file.userDataviewDetail?.edges))
    })
  }, [Role, project, skip, first])


  // let option: any[] = [];


  // for (var i = 0; i < lenn; i++) {
  //   const pn = projects.assignProjectUserid?.edges[i]?.node?.project.projectName
  //   option.push(pn);
  // }
  // console.log("Assign User Array", option)

  // useEffect(() => {

  //   const len = option.length
  //   if (len > 0) {
  //     for (var j = 0; j < len; j++) {
  //       let proName = option[j]
  //       project.push({ projectName: proName })
  //       console.log("project-->", project)
  //       setProject(project)
  //     }
  //   }

  //   request(`${BASEURL}graphql/`, ASSIGNED_PROJECTS, variables).then((res: any) => {
  //     setProjects(res);
  //     request(`${BASEURL}graphql/`, USER_DATAVIEW, { projects: project, skip: skip, first: first }).then((file: any) => setdata(file.userDataviewDetail?.edges))

  //   })
  //   // request(`${BASEURL}graphql/`, allProject).then((res: any) => setdata(res.allProjects))
  // }, [])


  console.log("pages1-->", data);

  // const data: any = user_dataview?.userDataviewDetail?.edges

  // console.log("Data1-->", data1)


  // const data: any[] = [];


  // for (let k = 0; k < user_dataview?.userDataviewDetail?.edges.length; k++) {
  //   data1.push(user_dataview?.userDataviewDetail?.edges[k].node)
  // }
  // console.log("reviewerData-->", reviewerData)

  const Pagination = (val: any) => {

    if (Math.sign(val) !== -1) { setSkip(val); }
  }

  const rowSize = (e: any) => {
    setFrist(e.target.value);

  }

  console.log("Projects1->", data)

  console.log("Columns", columns)
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })

  console.log("data.length !== first->", data.length !== first);
  console.log("Expand->", Expand);

  // const isLoading = useQueryResponseLoading()
  const Enable = skip === 0 ? "page-link disabled" : "page-link "
  const Disable = data.length !== first ? "page-link " : "page-link "

  console.log("pagi->", skip, first, Enable, Disable);

  return (
    <>

      {/* className="table  gy-7 gs-7" */}
      <KTCardBody className='py-4'>
        <div className='table-responsive'>
          <table
            id='kt_table_users'
            className='table  align-middle table-row-dashed fs-6 gy-5 dataTable no-footer table-striped'
            {...getTableProps()}
          >
            <thead>
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                {headers.map((column: ColumnInstance<User>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<User>, i: any) => {
                  prepareRow(row)
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />



                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                      No matching records found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <UsersListPagination data={data} /> */}
        {/* {isLoading && <UsersListLoading />} */}
        <span className="float-start mt-3"><b>Row size : </b> </span>
        <div className="float-start">

          <div className='pagination'>
            <select value={first} onChange={rowSize} className='form-select h-38px'>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              {/* <option value='75'>75</option>
            <option value='100'>100</option> */}

            </select>

          </div>
        </div>
        <div className="float-end">

          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item ">
                <a className={Enable} onClick={() => Pagination(skip - Number(first))}>Previous</a>
              </li>

              <li className="page-item">
                <a className={Disable} onClick={() => Pagination(skip + Number(first))}>Next</a>
              </li>
            </ul>
          </nav>

        </div>

      </KTCardBody>

    </>
  )
}

export { UsersTable }
