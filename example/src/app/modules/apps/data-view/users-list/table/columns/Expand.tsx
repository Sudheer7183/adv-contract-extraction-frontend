/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { useListView } from '../../core/ListViewProvider';

type Props = {
    allData?: any
}

const Expand: FC<Props> = ({ allData }) => {
    const { Expand, setExpand } = useListView()
    const openTable = () => {
        if (Expand === allData.node.id) {
            setExpand(0)
        } else {
            setExpand(allData.node.id)
        }
    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {
                        Expand === allData.node.id
                            ? <i className="bi bi-arrow-down" style={{ marginRight: "100px", fontSize: "25px", fontWeight: "bold" }}></i>
                            : <i className="bi bi-arrow-right" style={{ marginRight: "100px", fontSize: "25px", fontWeight: "bold" }}></i>

                    }
                </a>

            </div>
        </div>
    )
}


export { Expand }
