import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPendingPlus, handleUpgrade } from "../../redux/apiRequest";
import { Link } from "react-router-dom";

const PlusRequests = ({ accessToken }) => {
  const queryClient = useQueryClient();

  // Fetch pending plus
  const { data: pendingData, isLoading } = useQuery({
    queryKey: "pending-plus",
    queryFn: () => getPendingPlus(accessToken),
    staleTime: 1000 * 60 * 60 * 6,
  });

  // Handle upgrade
  const upgradeMutation = useMutation({
    mutationFn: ({ slug, decision }) =>
      handleUpgrade(slug, accessToken, decision),
    onSuccess: () => {
      queryClient.invalidateQueries("pending-plus");
    },
  });

  const handlePlus = (slug, decision) => {
    upgradeMutation.mutate({ slug, decision });
  };

  if (isLoading) return <p className="loading-text">Đang tải...</p>;

  return (
    <div className="service__section service__plus">
      <h2 className="service__title">Yêu cầu nâng cấp thẻ</h2>
      <div className="plus-grid">
        {pendingData?.data?.map((item) => (
          <div key={item.slug} className="plus-card">
            <Link className="plus-card__info" to={`/card/${item.slug}`}>
              <h4>{item.title}</h4>
              <p>Loại: {item.type}</p>
            </Link>
            <div className="plus-card__actions">
              <button
                className="service__btn service__btn--accept"
                onClick={() => handlePlus(item.slug, "plus")}
              >
                Chấp nhận
              </button>
              <button
                className="service__btn service__btn--reject"
                onClick={() => handlePlus(item.slug, "regular")}
              >
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlusRequests;