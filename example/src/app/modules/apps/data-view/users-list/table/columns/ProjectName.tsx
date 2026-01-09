/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    projectName?: any
}

const ProjectName: FC<Props> = ({ projectName }) => {
    console.log("projectName-titel", projectName.node.project.projectName);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + projectName.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {projectName.node.project.projectName}
                </a>

            </div>
        </div>
    )
}


export { ProjectName }
