import React, { useEffect, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query'
import { QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { deleteSelectedUsers } from '../../core/_requests'
import request, { gql } from 'graphql-request';
import { ExportToCsv } from 'export-to-csv';
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


const UsersListGrouping = () => {
  const { currentUser } = useAuth()
  const { selected, clearSelected } = useListView()
  const [projects, setProjects] = useState<any[]>([])
  const [project, setProject] = useState<any[]>([])
  const Id: any = currentUser?.id
  const Role: any = currentUser?.role

  const [user_dataview, setUser_dataview] = useState<any[]>([])

  const csvExporter = new ExportToCsv();
  const handleExportData = () => {
    let option: any[] = [];
    console.log("option->", option);

    for (let index = 0; index < selected.length; index++) {
      const element = reviewerData.filter((i: any) => i.id == selected[index]);
      console.log("element->", element[0]);
      option.push(element[0]);
    }
    csvExporter.generateCsv(option);
  };

  const reviewerData: any[] = [];
  console.log("reviewerData->", reviewerData);



  for (let k = 0; k < user_dataview?.userDataviewDetail?.edges.length; k++) {
    reviewerData.push(user_dataview?.userDataviewDetail?.edges[k].node)
  }

  useEffect(() => {
    request(`${BASEURL}graphql/`, ASSIGNED_PROJECTS, { id: Id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
      const lenn = data.assignProjectUserid?.edges.length
      let option: any[] = [];

      for (var i = 0; i < lenn; i++) {
        const pn = data.assignProjectUserid?.edges[i]?.node?.project.projectName
        option.push(pn);
      }
      const len = option.length
      if (len > 0) {
        for (var j = 0; j < len; j++) {
          let proName = option[j]
          project.push({ projectName: proName })
          console.log("project-->", project)
        }
      }
    })
    request(`${BASEURL}graphql/`, USER_DATAVIEW, { role: Role, projects: project }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setUser_dataview(file))
  }, [Role, project])

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>

      <button
        type='button'
        onClick={handleExportData}
        className={themec}
      >
        Export
      </button>
    </div>
  )
}

export { UsersListGrouping }
