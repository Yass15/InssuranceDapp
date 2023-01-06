import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'

function RowDetails({_id, username, email, contact, x_coordinate, y_coordinate, payment_status}) {
 
  return (
    <tr>
    <th>{_id}</th>
    <td>{username}</td>
    <td>{email}</td>
    <td>{contact}</td>
    <td>{x_coordinate}</td>
    <td>{y_coordinate}</td>
    <td>{payment_status}</td>
    <td className="gap__actions">
      <span className="badge bg-info">
        <Link to={`/${_id}`} className="text-white">
          <i className="fas fa-edit"></i>
        </Link>
      </span>


    </td>
  </tr>
  )
}

export default RowDetails