import React from 'react'

const User = ({data}) => {
    

  return (
    <div className="admin__user">
      <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {
          data?.map((item, index) => (
              <tr key={index}>
                <td className="user__item">
                    {item.username}
                </td>
                <td className="user__item">
                    {item.email}
                </td>
              </tr>
            ))
        }
      </tbody>
      </table>
    </div>
  )
}

export default User