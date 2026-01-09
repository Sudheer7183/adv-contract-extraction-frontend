// @ts-nocheck
import React from 'react';
import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'
// import { ProjectName } from './Title'
import { ProjectStatus } from './ProjectStatus';
import { Expand } from './Expand';
import { Title } from './Title';
import { EffectiveDate } from './EffectiveDate';
import { ProjectName } from './ProjectName';
import { FileName } from './FileName';
import { Doctype } from './Doctype';
import { ExpirationDate } from './ExpirationDate';
import { Parties } from './Parties';
import { Venue } from './Venue';
import { GoverningLaw } from './GoverningLaw';
import { PaymentDueDates } from './PaymentDueDates';
import { PaymentMethod } from './PaymentMethod';

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].node.id} />,
  },
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Project Name' className='min-w-125px' />,
  //   id: 'projectName',
  //   Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index].projectName} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title=' ' className='min-w-125px' />
    ),
    id: 'allData',
    Cell: ({ ...props }) => <Expand allData={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Project Name' className='min-w-125px text-capitalize' />
    ),
    id: 'projectName',
    Cell: ({ ...props }) => <ProjectName projectName={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='File Name' className='min-w-125px text-capitalize' />
    ),
    id: 'fileName',
    Cell: ({ ...props }) => <FileName fileName={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='DocType' className='min-w-125px text-capitalize' />
    ),
    id: 'doctype',
    Cell: ({ ...props }) => <Doctype doctype={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Title' className='min-w-125px text-capitalize' />
    ),
    id: 'data',
    Cell: ({ ...props }) => <Title data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Effective Date' className='min-w-125px text-capitalize' />
    ),
    id: 'effectiveDate',
    Cell: ({ ...props }) => <EffectiveDate effectiveDate={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Expiration Date' className='min-w-125px text-capitalize' />
    ),
    id: 'expirationDate',
    Cell: ({ ...props }) => <ExpirationDate expirationDate={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Parties' className='min-w-125px text-capitalize' />
    ),
    id: 'parties',
    Cell: ({ ...props }) => <Parties parties={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='venue' className='min-w-125px text-capitalize' />
    ),
    id: 'venue',
    Cell: ({ ...props }) => <Venue venue={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Governing Law' className='min-w-125px text-capitalize' />
    ),
    id: 'governingLaw',
    Cell: ({ ...props }) => <GoverningLaw governingLaw={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Payment Due Dates' className='min-w-125px text-capitalize' />
    ),
    id: 'paymentDueDates',
    Cell: ({ ...props }) => <PaymentDueDates paymentDueDates={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Payment Method' className='min-w-125px text-capitalize' />
    ),
    id: 'paymentMethod',
    Cell: ({ ...props }) => <PaymentMethod paymentMethod={props.data[props.row.index]} />,
  },
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='TotalFiles' className='min-w-125px' />,
  //   accessor: 'node.totalFiles',
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='ProjectStatus' className='min-w-125px' />
  //   ),
  //   id: 'dataStatus',
  //   Cell: ({ ...props }) => <ProjectStatus dataStatus={props.data[props.row.index]} />,
  // },


  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
  //   ),
  //   id: 'actions',
  //   Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  // },
]

export { usersColumns }
