import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'
import request, { gql } from 'graphql-request';
import Select from 'react-select';
import { Alert, Snackbar } from '@mui/material';
import BASEURL from '../../../../../../config/baseurl';

const ACTIVE_CATALOGS = gql`
query ActiveCatalogs($isactive: Boolean!){
  activeCatalogs(isactive: $isactive){
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        usercontracttypedetail{
          edges{
            node{
              fieldId
              fieldName
            }
          }
        }
      }
    }
  }
}`


const PROJECT = gql`
  query Project($name: String!) {
    projects(searchValue: $name) {
      edges {
        node {
          id
          projectName
          description
          active
          catalogFile{
            id
            catalogName
          }
          defaultContractType{
            id
            contractTypeName
            usercontracttypedetail{
              edges{
                node{
                  fieldName
                }
              }
            }
          }
        }
      }
    }
  }
`;


const USER_CONTRACT_TYPE = gql`
mutation userContractType(
  $files: [FilesInput]!
  $userContractType: Int!
){
  userContractType(
    input:{
      files: $files
      userContractType: $userContractType
    }
  ){
    userContract{
      fileName
      fileType
      filePath
      userContractType{
        contractTypeName
      }
      project{
        id
        projectName
      }
    }
  }
}
`


const UsersListGrouping = () => {
  const { selected, name, setUpdate } = useListView()
  console.log("NAME id ->", name, selected);
  const [data, setData] = useState<any[]>([]);
  const [pro, setPro] = useState<any[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState<any[]>([]);
  const [ctypeval, setCTypeVal] = useState("");
  const [message, setMessage] = useState("")
  const [message1, setMessage1] = useState(false)
  const [open1, setOpen1] = useState(false);

  let option2: any[] = [];

  useEffect(() => {
    request(`${BASEURL}graphql/`, ACTIVE_CATALOGS, { isactive: true }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((data: any) => setData(data.activeCatalogs))
    request(`${BASEURL}graphql/`, PROJECT, { name: name }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((e: any) => {
      setPro(e)
    })
  }, [name]);


  const cf = pro && pro?.projects?.edges[0]?.node?.catalogFile?.id

  for (let l = 0; l < data?.length; l++) {
    if (data[l].id == cf) {
      console.log("default Contract Type array", data[l].catalogdetail)
      let length = data[l].catalogdetail.length
      console.log("lenth", length);
      for (let j = 0; j < length; j++) {
        const ct = data[l].catalogdetail[j].userContractTypeMaster.contractTypeName
        const dctId = data[l].catalogdetail[j].userContractTypeMaster.id
        option2.push({ value: ct, label: ct, id: dctId });
      }
    }
  }

  const handleChange2 = (selectedOption: any) => {
    console.log("contract type selectedOption", selectedOption)
    console.log("contract type selectedOption value", selectedOption.value)
    setSelectedOption2(selectedOption);
    setCTypeVal(selectedOption.id)
  };


  let fileIdArr: any[] = []

  for (let i = 0; i < selected.length; i++) {
    console.log("selected array", selected[i]);
    fileIdArr.push({ fileId: selected[i] })
  }

  console.log("filesId Array", fileIdArr)
  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleSave = (e: any) => {
    setShowSave(!showSave);
    request(`${BASEURL}graphql/`, USER_CONTRACT_TYPE, { files: fileIdArr, userContractType: ctypeval }, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        setOpen1(true);
        setMessage1(true)
        setMessage("Successfully Assigned the ContractType")
        setUpdate(true)
        console.log("res", res);

      })
      .catch((error: any) => {
        setOpen1(true);
        setMessage("Something Went Wrong")
        setMessage1(false)
        console.log("Error Message", error)
      });
    console.log("Saved ");
  }

  const colorv = localStorage.getItem("themeColor")
  console.log("colorcolor", colorv)
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <div className='d-flex justify-content-end align-items-center' style={{ marginLeft: '10px' }}>
      <Snackbar anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }} style={{ float: "right" }} open={open1} autoHideDuration={6000} onClose={handleClose1}>
        {message1 ?
          <Alert onClose={handleClose1} variant="filled" severity="success" sx={{ width: '100%' }}>
            {message}!
          </Alert>
          : <Alert onClose={handleClose1} variant="filled" severity="error" sx={{ width: '100%' }}>
            {message}!
          </Alert>}
      </Snackbar>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>
      <Select
        className="dropdown"
        placeholder="Assign Contract Type"
        value={selectedOption2}
        isSearchable={true}
        onChange={handleChange2}
        options={option2}
      />&nbsp;&nbsp;
      <button
        type='button'
        className={themec}
        disabled={selectedOption2.length === 0}
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}

export { UsersListGrouping }
