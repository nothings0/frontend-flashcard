import { useState } from "react";
import { useQuery } from "react-query";
import { getRequestWithdrawals } from "../redux/apiRequest";
import { useSelector } from "react-redux";
import Skeleton from "../components/Skeleton";
import List from "./components/List";
import dayjs from "dayjs";
import QRModal from "./components/QRModal";

const AdminWithdrawal = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const { data, isLoading } = useQuery({
    queryFn: () => getRequestWithdrawals(accessToken),
    queryKey: ["admin-withdrawals"],
  });

  if (isLoading) return <Skeleton />;

  return (
    <div className="header-title">
      <h1>Quản lý rút tiền</h1>
      <List
        data={data}
        currentPage={page}
        total={total}
        limit={limit}
        columns={["code", "amount", "status", "createdAt"]}
        onView={setSelected}
        onPageChange={setPage}
        customRender={{
          amount: (val) => <span>{val.toLocaleString()}đ</span>,
          status: (val) => <span className={`badge badge-${val}`}>{val}</span>,
          createdAt: (val) => dayjs(val).format("DD/MM/YYYY"),
        }}
      />

      {selected && (
        <QRModal data={selected} onClose={() => setSelected(null)} accessToken={accessToken}/>
      )}
    </div>
  );
};

export default AdminWithdrawal;
