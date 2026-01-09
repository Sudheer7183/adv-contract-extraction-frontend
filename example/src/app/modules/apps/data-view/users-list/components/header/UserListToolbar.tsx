import React, { useEffect, useState } from 'react';
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { ExportToCsv } from 'export-to-csv';
import request, { gql } from 'graphql-request';
import { useAuth } from '../../../../../auth';
import BASEURL from '../../../../../../config/baseurl';

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
query userDataviewDetail($role: String!, $projects: [ProjectsInput]!){
  userDataviewDetail(value: $role, projects: $projects){
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


const UsersListToolbar = () => {
  const { currentUser } = useAuth()
  const { setItemIdForUpdate } = useListView()
  const [projects, setProjects] = useState<any[]>([])
  const [project, setProject] = useState<any[]>([])
  const Id: any = currentUser?.id
  const Role: any = currentUser?.role

  const variables = {
    id: Id,
  }
  const [user_dataview, setUser_dataview] = useState<any[]>([])

  const csvExporter = new ExportToCsv();
  const handleExportData = () => {
    csvExporter.generateCsv(reviewerData);
  };
  const lenn = projects.assignProjectUserid?.edges.length




  let option: any[] = [];




  for (var i = 0; i < lenn; i++) {
    const pn = projects.assignProjectUserid?.edges[i]?.node?.project.projectName
    option.push(pn);
  }
  const reviewerData: any[] = [];
  console.log("reviewerData->", reviewerData);



  for (let k = 0; k < user_dataview?.userDataviewDetail?.edges.length; k++) {
    reviewerData.push(user_dataview?.userDataviewDetail?.edges[k].node)
  }
  console.log("Assign User Array", option)


  useEffect(() => {
    const len = option.length
    if (len > 0) {
      for (var j = 0; j < len; j++) {
        let proName = option[j]
        project.push({ projectName: proName })
        console.log("project-->", project)
        setProject(project)
      }
    }


    // request(`${BASEURL}graphql/`, allProject).then((res: any) => setdata(res.allProjects))
    request(`${BASEURL}graphql/`, ASSIGNED_PROJECTS, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setProjects(data))
    request(`${BASEURL}graphql/`, USER_DATAVIEW, { role: Role, projects: project }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setUser_dataview(file))
  }, [Role, project])
  console.log("project-->", projects)


  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      {/* begin::Export */}
      <button type='button' onClick={handleExportData} className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button>
      {/* end::Export */}
    </div>
  )
}

export { UsersListToolbar }
