import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import Select from 'react-select';
import { request, gql } from 'graphql-request'
import BASEURL from '../../../../../config/baseurl'

type Props = {
  id: number
}

const editUserSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Wrong email format')
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Email is required'),
  password: Yup.string()
    // .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  // name: Yup.string()
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Name is required'),
  // first_name: Yup.string()
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Name is required'),
  // last_name: Yup.string()
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Name is required'),
})

const activeProject = gql`
query ActiveProject($isactive: Boolean!) {
  activeProject(isactive: $isactive) {
    edges {
      node {
        id
        projectId
        projectName
        active
      }
    }
  }
}`

const userProject = gql`
query UserWithProject($id: String!) {
  userWithProject(search: $id) {
    edges {
      node {
        id
        email
        username
        password
        firstName
        lastName
        role
        isActive
        projects {
          id
          projectName
        }
      }
    }
  }
}`
const getUser = gql`
query GetUser($id: String!){
  getUser(id: $id){
    email
    username
    firstName
    lastName
    isActive
    role
    projects{
      edges{
        node{
          id
          projectName
        }
      }
    }
  }
}

`
const updateUsers = gql`
mutation UpdateUser(
  $email: String!
  $username: String!
  $firstname: String!
  $lastname: String!
  $active: Boolean!
  $assignProject: [ProjectsInput]!
) {
  updateUser(
    input: {
      email: $email
      username: $username
      firstname: $firstname
      lastname: $lastname
      active: $active
      assignProject: $assignProject
    }
  ) {
    users {
      id
      email
      role
      username
      firstName
      lastName
      isActive
    }
  }
}`

const EditModalForm: FC<Props> = ({ id }) => {
  console.log("user edit id props value", id);
  const { setItemIdForUpdate, setUpdate } = useListView()
  const [data, setdata] = useState([])
  const { refetch } = useQueryResponse()
  const [projects, setProjects] = useState<any>({});
  const [proUsers, setProUsers] = useState<any>({});
  const [assignProjects, setAssignProjects] = useState<any[]>([])
  const Active = true
  const variables = {
    isactive: Active,
  }
  useEffect(() => {
    request(`${BASEURL}graphql/`, getUser, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.getUser))
    request(`${BASEURL}graphql/`, activeProject, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((pro: any) => setProjects(pro.activeProject.edges))
    request(`${BASEURL}graphql/`, userProject, { id: id }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setProUsers(res.userWithProject.edges[0].node.projects))
  }, [])
  console.log("edit user data---->", data);

  const mail = data.email
  const role = data.role
  const uname = data.username
  const fname = data.firstName
  const lname = data.lastName
  const userActive = data.isActive

  const [email, setEmail] = useState(mail)
  const [username, setUsername] = useState(uname)
  const [firstname, setFirstname] = useState(fname)
  const [lastname, setLastname] = useState(lname)
  const [isChecked, setIsChecked] = useState(userActive);

  useEffect(() => {
    setEmail(mail)
    setUsername(uname)
    setIsChecked(userActive)
    setFirstname(fname)
    setLastname(lname)
  }, [mail, uname, userActive, fname, lname]
  )
  console.log("Assigned ProUsers --->", proUsers)


  const [selectedOption, setSelectedOption] = useState<any[]>([]);

  useEffect(() => {
    let option2: any[] = [];

    for (let i = 0; i < proUsers.length; i++) {
      const pn = proUsers[i].projectName
      const pn1 = proUsers[i].projectName
      option2.push({ value: pn, label: pn1 });
    }
    setSelectedOption(option2)
  }, [proUsers]
  )


  console.log("Active_Projects", projects)
  const [userForEdit] = useState<User>({
    // avatar: user.avatar || initialUser.avatar,
    role: initialUser.role,
    password: initialUser.password,
    name: initialUser.name,
    email: initialUser.email,
    first_name: initialUser.first_name,
    last_name: initialUser.last_name,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  let option: any[] = [];

  for (let i = 0; i < projects.length; i++) {
    const pn = projects[i]?.node?.projectName
    const pn1 = projects[i]?.node?.projectName
    option.push({ value: pn, label: pn1 });
  }

  console.log("Active project Array", option)

  // const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`/media/${userForEdit.avatar}`)

  const handleActiveStatus = () => {
    setIsChecked(!isChecked);
  }
  console.log("Active status->", isChecked);

  const handleChange = (selectedOption: any) => {
    console.log("selectedOption", selectedOption)
    setSelectedOption(selectedOption);
  };

  const updateUsername = (e: any) => {
    setUsername(e.target.value)
  }

  const updateFirstName = (e: any) => {
    setFirstname(e.target.value)
  }

  const updateLastName = (e: any) => {
    setLastname(e.target.value)
  }


  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      console.log("user submitted values", values)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  const onSubmit = async (e: any) => {
    e.preventDefault()
    let len = selectedOption.length
    for (var i = 0; i < len; i++) {
      let proName = selectedOption[i].value
      assignProjects.push({ projectName: proName })
      setAssignProjects(assignProjects)
    }
    console.log(`Option selected2:`, assignProjects);
    const variables = {
      email: email,
      username: username,
      firstname: firstname,
      lastname: lastname,
      active: isChecked,
      assignProject: assignProjects
    }

    request(`${BASEURL}graphql/`, updateUsers, variables, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((response: any) => console.log(response))
    // const { data } = await user({ variables: { email: email, password: password, username: username, firstname: firstname, lastname: lastname, active: isChecked, role: role, assignProject: assignProjects } })
    // console.log("create", data)
    setAssignProjects([])
    setUpdate(true)
  }
  const colorv = localStorage.getItem("themeColor")
  const themec = colorv + " " + 'btn' + " " + 'bg-opacity-75'


  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={onSubmit} noValidate>
        {/* <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate> */}
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              value={email}
              autoComplete='off'
              disabled
            />
            {/* end::Input */}
            {/* {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )} */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>User Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='User name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              onChange={updateUsername}
              value={username}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>First Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='First name'
              {...formik.getFieldProps('first_name')}
              type='text'
              name='first_name'
              onChange={updateFirstName}
              value={firstname}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                {
                  'is-valid': formik.touched.first_name && !formik.errors.first_name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.first_name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Last Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Last name'
              {...formik.getFieldProps('last_name')}
              type='text'
              name='last_name'
              onChange={updateLastName}
              value={lastname}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.last_name && formik.errors.last_name },
                {
                  'is-valid': formik.touched.last_name && !formik.errors.last_name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.last_name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              <input {...formik.getFieldProps('active')} type="checkbox" onChange={handleActiveStatus} checked={isChecked} />&nbsp;&nbsp;
              <span>Active</span>
            </label>
            {/* end::Label */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          {role && role == "Reviewer" ?
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>Assign Projects</label>
              {/* end::Label */}

              {/* begin::Input */}
              <Select
                className="dropdown"
                isMulti={true}
                value={selectedOption}
                isSearchable={true}
                onChange={handleChange}
                options={option}
              />
              {/* end::Input */}
            </div> : null
          }
          {/* end::Input group */}

        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting}
          >
            Discard
          </button>

          <button
            type='submit'
            className={themec}
            data-kt-users-modal-action='submit'
            disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {/* {(formik.isSubmitting) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )} */}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting) && <UsersListLoading />}
    </>
  )
}

export { EditModalForm }
