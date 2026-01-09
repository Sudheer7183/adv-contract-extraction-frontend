// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'
import { UserFileOpenCell } from './UserFileOpenCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
import { FileName } from './FileName';
import { FileType, UserLastLoginCell } from './FileType'
import { FileStatus } from './FileStatus';
import { FilePages } from './FilePage';
import { LockStatus } from './LockStatus';
import { Actions } from './Actions';
import { ContractFileType } from './ContractFileType';
import { AssignedUser } from './AssignedUser';
import { Language } from './Language';
import { DocumentType } from './DocumentType';


const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <div style={{ marginLeft: '20px', paddingTop: '20px' }}>
        <UserSelectionHeader tableProps={props} />
      </div>
    ),
    id: 'selection',
    Cell: ({ ...props }) => (
      <div style={{ marginLeft: '30px' }}>
        <UserSelectionCell id={props.data[props.row.index].id} />
      </div>
    ),
  },
  // {
  //   Header: (props: any) => (
  //     <UserCustomHeader tableProps={props} title='File name' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'userContractType.contractTypeName',
  //   Cell: ({ ...props }) => <ContractFileType userContract={props.data[props.row.index]} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Document Name' className='min-w-125px text-capitalize' />
    ),
    accessor: 'document_title',
    
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='FileName' className='min-w-125px text-capitalize' />
    ),
    accessor: 'fileName',
    // Cell: ({ ...props }) => <FileName data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Parties' className='min-w-125px text-capitalize' />
    ),
    accessor: 'parties',
    // Cell: ({ ...props }) => <FileStatus fileStatus={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Effective Date' className='min-w-125px text-capitalize' />
    ),
    accessor: 'effective_date',
    // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Expiry Date' className='min-w-125px text-capitalize' />
    ),
    accessor: '“maturity_date”/“termination_date”_definition',
    // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  },
  //   {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Indemnity' className='min-w-125px text-capitalize' />
  //   ),
  //   accessor: 'indemnity',
  //   // Cell: ({ ...props }) => <Language data={props.data[props.row.index]} />,
  // },
  // {
  //   Header: (props: any) => (
  //     <UserCustomHeader tableProps={props} title='FilePath' className='min-w-125px text-capitalize' />
  //   ),
  //   accessor: 'filePath',
  //   // Cell: ({ ...props }) => <AssignedUser userFile={props.data[props.row.index]} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Document Type' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'document_type',
  //   Cell: ({ ...props }) => <DocumentType data={props.data[props.row.index]} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Number of Pages' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'pages',
  //   Cell: ({ ...props }) => <FilePages filePages={props.data[props.row.index]} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Lock Status' className='min-w-125px text-capitalize' />
  //   ),
  //   id: 'lockedBy',
  //   Cell: ({ ...props }) => <LockStatus lockStatus={props.data[props.row.index]} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px text-capitalize' />
  //   ),
  //   id: 'actions',
  //   Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index]} />,
  // },

]

export { usersColumns }
