import React from "react";

const Card = ({ data, handleDeleteCard }) => {
  return (
    <div className="admin__card">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td className="card__item">{item.title}</td>
              <td className="card__item">{item.user.username}</td>
              <td className="card__item">{item.views}</td>
              <i
                className="fa-solid fa-xmark"
                onClick={() => handleDeleteCard(item.slug, index)}
              ></i>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Card;
