import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable, { MRT_RowSelectionState } from 'material-react-table';
// import { useQuery } from '@apollo/client';
// import { ASSIGNED_PROJECTS, USER_DATAVIEW } from '../graphql/Queries';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
// import { useNavigate } from 'react-router-dom';
import DataView1 from './DataView';
import request, { gql } from 'graphql-request';
import { useAuth } from '../../auth';
import BASEURL from '../../../config/baseurl';


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
query userDataviewDetail($projects: [ProjectsInput]!){
  userDataviewDetail(projects: $projects){
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
const ViewData = () => {
    const { currentUser } = useAuth()

    console.log(" current user values--->", currentUser);
    console.log("User role", currentUser?.id);
    const Id = currentUser?.id
    const Role = currentUser?.role
    const variables = {
        id: Id,
    }
    // const projects = useQuery(ASSIGNED_PROJECTS, { variables: { id: Id } });
    const [project, setProject] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [user_dataview, setUser_dataview] = useState<any[]>([])

    // console.log("Assigned Projects -->", projects.data)
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});


    const lenn = projects.assignProjectUserid?.edges.length


    let option: any[] = [];


    for (var i = 0; i < lenn; i++) {
        const pn = projects.assignProjectUserid?.edges[i]?.node?.project.projectName
        option.push(pn);
    }
    console.log("Assign User Array", option)
    const len = option.length

    useEffect(() => {

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
        request(`${BASEURL}graphql/`, USER_DATAVIEW, { projects: project }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setUser_dataview(file))
    }, [project, len])
    console.log("project-->", project)

    // const user_dataview = useQuery(USER_DATAVIEW, { variables: { projects: project } })

    console.log("UserDataview Detail-->", user_dataview)

    const data1 = user_dataview?.userDataviewDetail?.edges

    console.log("Data1-->", data1)


    const reviewerData: any[] = [];


    for (let k = 0; k < user_dataview?.userDataviewDetail?.edges.length; k++) {
        reviewerData.push(user_dataview?.userDataviewDetail?.edges[k].node)
    }
    console.log("reviewerData-->", reviewerData)
    // const Closed = () => {
    //     nav(`/Document-Viewer/projects`)
    // }


    const columns = useMemo(
        () => [
            {
                accessorKey: 'project.projectName',
                header: 'Project Name', //uses the default width from defaultColumn prop
            },
            {
                accessorKey: 'fileName',
                header: 'File Name', //uses the default width from defaultColumn prop
            },
            {
                accessorKey: 'doctype',
                header: 'Doc Type',
                enableResizing: 120, //disable resizing for this column
            },
            {
                accessorKey: 'title',
                header: 'Title',
                size: 200, //increase the width of this column
            },
            {
                accessorKey: 'effectiveDate',
                header: 'Effective_date',
                size: 120, //decrease the width of this column
            },
            {
                accessorKey: 'expirationDate',
                header: 'Exp_date',
                size: 100, //decrease the width of this column
            },
            {
                accessorKey: 'parties',
                header: 'Parties', //uses the default width from defaultColumn prop
            },
            {
                accessorKey: 'venue',
                header: 'Venue',
                enableResizing: 120, //disable resizing for this column
            },
            {
                accessorKey: 'governingLaw',
                header: 'Governing_law',
                size: 200, //increase the width of this column
            },
            {
                accessorKey: 'paymentDueDates',
                header: 'Payment_due_date',
                size: 120, //decrease the width of this column
            },
            {
                accessorKey: 'paymentMethod',
                header: 'Payment_method',
                size: 100, //decrease the width of this column
            },
        ],
        [],
    );


    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: true,
        headers: columns.map((c) => c.header),
    };


    const csvExporter = new ExportToCsv(csvOptions);


    const handleExportRows = (rows: any) => {
        csvExporter.generateCsv(rows.map((row: any) => row.original));
    };


    const handleExportData = () => {
        csvExporter.generateCsv(reviewerData);
    };


    // const handleChange = () => {
    //     nav("/Document-Viewer/dataview")
    // }


    return (<React.Fragment>

        {Role === "Admin" ?
            <div className='table_top'>
                <MaterialReactTable
                    columns={columns}
                    data={reviewerData ?? []}
                    defaultColumn={{
                        maxSize: 400,
                        minSize: 80,
                        size: 150, //default size is usually 180
                    }}
                    enableColumnResizing
                    columnResizeMode="onChange" //default
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                            background: 'rgba(52, 210, 235, 0.1)',
                            borderRight: '1px solid rgba(224,224,224,1)',
                            color: theme.palette.text.primary,
                        }),
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: () =>
                            setRowSelection((prev: any) => ({
                                ...prev,
                                [row.id]: !prev[row.id],
                            })),
                        selected: rowSelection[row.id],
                        sx: {
                            cursor: 'pointer',
                        },
                    })}
                    state={{ rowSelection }}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box
                            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                        >
                            <Button
                                color="primary"
                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={handleExportData}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export
                            </Button>
                            <Button
                                disabled={
                                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                }
                                //only export selected rows
                                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export Selected Rows
                            </Button>
                            {/* <Button
                                color="primary"
                                onClick={handleChange}
                                variant="contained"
                            >
                                Detailed Dataview
                            </Button> */}
                        </Box>
                    )}
                    renderDetailPanel={({ row }) => (
                        <Box
                            sx={{
                                display: 'grid',
                                margin: 'auto',
                                gridTemplateColumns: '1fr 1fr',
                                width: '100%',
                            }}
                        >
                            <DataView1
                                pname={row.original.project.projectName}
                                fname={row.original.fileName}
                            />
                            {/* <p>No data</p> */}
                        </Box>
                    )}
                />
            </div> :
            <div className='table_top'>
                <MaterialReactTable
                    columns={columns}
                    data={reviewerData ?? []}
                    defaultColumn={{
                        maxSize: 400,
                        minSize: 80,
                        size: 150, //default size is usually 180
                    }}
                    enableColumnResizing
                    columnResizeMode="onChange" //default
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                            background: 'rgba(52, 210, 235, 0.1)',
                            borderRight: '1px solid rgba(224,224,224,1)',
                            color: theme.palette.text.primary,
                        }),
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: () =>
                            setRowSelection((prev: any) => ({
                                ...prev,
                                [row.id]: !prev[row.id],
                            })),
                        selected: rowSelection[row.id],
                        sx: {
                            cursor: 'pointer',
                        },
                    })}
                    state={{ rowSelection }}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box
                            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                        >
                            <Button
                                color="primary"
                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={handleExportData}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export
                            </Button>
                            <Button
                                disabled={
                                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                }
                                //only export selected rows
                                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export Selected Rows
                            </Button>
                            {/* <Button
                                color="primary"
                                onClick={handleChange}
                                variant="contained"
                            >
                                Detailed Dataview
                            </Button> */}
                        </Box>
                    )}
                    renderDetailPanel={({ row }) => (
                        <Box
                            sx={{
                                display: 'grid',
                                margin: 'auto',
                                gridTemplateColumns: '1fr 1fr',
                                width: '100%',
                            }}
                        >
                            <DataView1
                                pname={row.original.project.projectName}
                                fname={row.original.fileName}
                            />
                        </Box>
                    )}
                />
            </div>
        }


    </React.Fragment>)
}




export default ViewData;
