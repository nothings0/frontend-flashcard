import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPendingPremium, handleUpgrade } from "../../redux/apiRequest";
import { Link } from "react-router-dom";

const PremiumRequests = ({ accessToken }) => {
  const queryClient = useQueryClient();

  // Fetch pending premium
  const { data: pendingData, isLoading } = useQuery({
    queryKey: "pending-premium",
    queryFn: () => getPendingPremium(accessToken),
    staleTime: 1000 * 60 * 60 * 6,
  });

  // Handle upgrade
  const upgradeMutation = useMutation({
    mutationFn: ({ slug, decision }) =>
      handleUpgrade(slug, accessToken, decision),
    onSuccess: () => {
      queryClient.invalidateQueries("pending-premium");
    },
  });

  const handlePremium = (slug, decision) => {
    upgradeMutation.mutate({ slug, decision });
  };

  if (isLoading) return <p className="loading-text">Đang tải...</p>;

  return (
    <div className="service__section service__premium">
      <h2 className="service__title">Yêu cầu nâng cấp thẻ</h2>
      <div className="premium-grid">
        {pendingData?.data?.map((item) => (
          <div key={item.slug} className="premium-card">
            <Link className="premium-card__info" to={`/card/${item.slug}`}>
              <h4>{item.title}</h4>
              <p>Loại: {item.type}</p>
            </Link>
            <div className="premium-card__actions">
              <button
                className="service__btn service__btn--accept"
                onClick={() => handlePremium(item.slug, "premium")}
              >
                Chấp nhận
              </button>
              <button
                className="service__btn service__btn--reject"
                onClick={() => handlePremium(item.slug, "regular")}
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

export default PremiumRequests;