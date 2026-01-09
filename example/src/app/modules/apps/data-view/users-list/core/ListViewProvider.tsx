import React, { FC, useState, createContext, useContext, useMemo, useEffect } from 'react'
import {
  ID,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  initialListView,
  ListViewContextProps,
  groupingOnSelectAll,
  WithChildren,
} from '../../../../../../_metronic/helpers'
import { useQueryResponse, useQueryResponseData } from './QueryResponseProvider'
import request, { gql } from 'graphql-request';
import { useAuth } from '../../../../auth';
import BASEURL from '../../../../../config/baseurl';


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


const ListViewContext = createContext<ListViewContextProps>(initialListView)


const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [Expand, setExpand] = useState<ID>(initialListView.Expand)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [isEdit, setIsEdit] = useState<boolean>(initialListView.isEdit)
  const [Hide, setHide] = useState<boolean>(initialListView.Hide)
  const { isLoading } = useQueryResponse()
  const [projects, setProjects] = useState<any[]>([])
  const [project, setProject] = useState<any[]>([])
  const Id: any = currentUser?.id
  const Role: any = currentUser?.role

  const [user_dataview, setUser_dataview] = useState<any[]>([])


  const data: any[] = [];

  for (let k = 0; k < user_dataview?.userDataviewDetail?.edges.length; k++) {
    data.push(user_dataview?.userDataviewDetail?.edges[k].node)
  }
  // console.log("Assign User Array", option)


  useEffect(() => {
    request(`${BASEURL}graphql/`, ASSIGNED_PROJECTS, { id: Id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => {
      const lenn = data.assignProjectUserid?.edges.length

      for (let i = 0; i < lenn; i++) {
        const pn = data.assignProjectUserid?.edges[i]?.node?.project.projectName
        projects.push(pn);
      }
      const len = projects.length
      if (len > 0) {
        for (let j = 0; j < len; j++) {
          let proName = projects[j]
          project.push({ projectName: proName })
          console.log("project-->", project)
          // setProject(project)
        }
      }
      console.log("outside if project-->", project)
      request(`${BASEURL}graphql/`, USER_DATAVIEW, { role: Role, projects: project }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setUser_dataview(file))
    })
  }, [Role, project])
  // console.log("project-->", projects)
  // const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])


  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        Expand,
        setExpand,
        disabled,
        isAllSelected,
        isEdit,
        Hide,
        setIsEdit,
        setHide,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}


const useListView = () => useContext(ListViewContext)


export { ListViewProvider, useListView }
