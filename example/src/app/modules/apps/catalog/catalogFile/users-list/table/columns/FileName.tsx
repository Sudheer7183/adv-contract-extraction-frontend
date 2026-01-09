/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    fileName?: any
}

const FileName: FC<Props> = ({ fileName }) => {
    console.log("fileName-titel", fileName.node.fileName);

    const nav = useNavigate();
    const openTable = () => {
        // setItemIdForUpdate(id)
        nav("/document-management/document/" + fileName.node.id);

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {fileName.node.fileName}
                </a>

            </div>
        </div>
    )
}


export { FileName }
