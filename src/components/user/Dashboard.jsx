import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateAchieve } from "../../redux/apiRequest";

const Dashboard = ({ data }) => {
  const [target, setTarget] = useState(0);
  const [isEdit, setEdit] = useState(false);
  const [targetA, setTargetA] = useState(0);

  const user = useSelector((state) => state.user.currentUser?.user.username);
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const { username } = useParams();
  useEffect(() => {
    setTarget(data?.targetRes);
    setTargetA(data?.targetRes);
  }, [data]);

  const handleUpdate = () => {
    if (isEdit) {
      setEdit(!isEdit);
      setTargetA(target);
      UpdateAchieve(target, accessToken);
    } else {
      setEdit(!isEdit);
    }
  };

  return (
    <div className="dashboard_user">
      <div className="dashboard__title">Thống kê</div>
      <div className="dashboard__target">
        <div className="dashboard__target__left">
          Mục tiêu ghi nhớ
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Nhập mục tiêu"
            disabled={!isEdit}
          />
        </div>
        {user === username && (
          <div className="dashboard__target__right">
            {!isEdit ? (
              <i className="fa-solid fa-pencil" onClick={handleUpdate}></i>
            ) : (
              <i className="fa-solid fa-check" onClick={handleUpdate}></i>
            )}
          </div>
        )}
      </div>
      <div className="dashboard__container">
        {data?.achieveArr.map((item, index) => {
          let percent = ((item.data / target) * 100).toFixed(1);
          let style = {
            background: `conic-gradient(#349eff ${
              percent * 3.6
            }deg, #ededed 0deg)`,
          };
          return (
            <div className="dashboard-item" key={index}>
              <div className="dashboard-item__title">{item.title}</div>
              <div className="dashboard__middle">
                <div className="dashboard__middle__left">
                  <h3>Total</h3>
                  <h2>
                    {item.data}/{targetA}
                  </h2>
                </div>
                <div className="dashboard__middle__right">
                  <div className="dashboard__middle__progress" style={style}>
                    <div className="dashboard__middle__progress__value">
                      {percent} %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
