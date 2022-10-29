import Card from './Card'
import { Link } from 'react-router-dom';

const List = ({title, data, type}) => {
  return (
    <>
    {
      data?.length > 0 &&
      <div className="list">
        <div className="list__heading">
          <h3 className="list__heading__title">{title}</h3>
          {
            type !== 'recent' && <Link to={`/list/${type}`} className="list__heading__more">Xem thêm <i className="fa-solid fa-angle-right"></i></Link>
          }
        </div>
        <div className="list__container">
          {
            data?.map((item, index) => (
              <Card data={item} key={index}/>
            ))
          }
        </div>
      </div>
    }
    </>
  )
}

export default List