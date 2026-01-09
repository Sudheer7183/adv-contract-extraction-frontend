import * as React from 'react';
// import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../config/baseurl';


function createData(
    FieldName: string,
    FieldValue: string,
) {
    return {
        FieldName,
        FieldValue,
    };
}

const DATA_VIEW = gql`
query dataView($project: String!, $file: String!){
  dataView(project: $project, file: $file){
    edges{
      node{
        id
        file{
          fileName
          project{
            id
            projectName
          }
          doctype
        }
        fieldName
        fieldValue
        docdataaudit{
          edges{
            node{
              fieldName
              fieldValue
            }
          }
        }
      }
    }
  }
}`




function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {row.docdataaudit?.edges == 0 ? "" : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.fieldName}</TableCell>
                <TableCell align="left">{row.fieldValue}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            {row.docdataaudit?.edges != 0 ?
                                <Table size="small" aria-label="purchases">
                                    <TableHead className='text-muted '>
                                        <TableRow>
                                            <TableCell >FieldName</TableCell>
                                            <TableCell >FieldValue</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.docdataaudit?.edges ?
                                            row.docdataaudit?.edges
                                                .map((val: any) => {




                                                    return (<TableRow key={val?.node?.id}>
                                                        <TableCell>{val.node.fieldName}</TableCell>
                                                        <TableCell style={{ wordBreak: 'break-word' }}>{val?.node?.fieldValue}</TableCell>
                                                    </TableRow>);




                                                }) : <TableRow> No Data found</TableRow>}
                                    </TableBody>
                                </Table> : <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: '20%' }}>FieldName</TableCell>
                                            <TableCell>Text</TableCell>
                                            {/* <TableCell>CreatedAt</TableCell>
                                        <TableCell>ModifiedAt</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <tr><td>No Data found</td></tr>
                                    </TableBody>
                                </Table>}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}



interface Props {
    // dataid: number;
    pname: string;
    fname: string;
}
export default function DataView1({
    // dataid,
    pname,
    fname
}: Props) {




    console.log("DATAID PNAME --->", pname, fname);
    const [fields, setFields] = React.useState<any[]>([])




    // const fields = useQuery(DATA_VIEW, { variables: { project: pname, file: fname } });
    // console.log("FieldName", fields);
    React.useEffect(() => {
        request(`${BASEURL}graphql/`, DATA_VIEW, { project: pname, file: fname }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((file: any) => setFields(file))
    }, [])
    console.log("fields->", fields);

    return (
        <>
            <div style={{ width: '130%' }} >
                <TableContainer component={Paper} style={{ width: '120%' }}>
                    <Table className='col_table'>
                        <TableHead className='text-muted '>
                            <TableRow>
                                <TableCell />
                                <TableCell>FieldName</TableCell>
                                <TableCell >FieldValue</TableCell>
                                {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields?.dataView?.edges
                                .map((row: any) => (
                                    <Row key={row.node?.id} row={row.node} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
