import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateMultipleNotifi,
  GetContact,
  getPendingPremium,
  handleUpgrade,
} from "../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Service = () => {
  const [contacts, setContacts] = useState([]);
  const [content, setContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const res = await GetContact(accessToken);
      setContacts(res);
    };
    getData();
  }, [accessToken]);

  const handleNotifi = async () => {
    await CreateMultipleNotifi(dispatch, accessToken, { content });
  };

  const { data, isLoading } = useQuery({
    queryFn: () => getPendingPremium(accessToken),
    queryKey: "pending-premium",
    staleTime: 6 * 60 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: ({ slug, decision }) =>
      handleUpgrade(slug, accessToken, decision),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handlePremium = (slug, decision) => {
    mutation.mutate({ slug, decision });
  };

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="service">
      <div className="contact">
        {contacts?.data?.length > 0 ? (
          contacts.data.map((item) => (
            <div className="contact__item">
              <div className="contact__txt">Tiêu đề: {item.title}</div>
              <div className="contact__txt">Email: {item.email}</div>
              <div className="contact__txt">
                Description: {item.description}
              </div>
            </div>
          ))
        ) : (
          <h3>Không có email cần xử lý</h3>
        )}
      </div>
      <div className="service__button">
        <button onClick={() => setModalOpen(true)}>Tạo thông báo</button>
      </div>
      <div className="service__card">
        {data.data.map((item) => (
          <div className="service__card__item">
            <h4>{item.title}</h4>
            <p>{item.type}</p>
            <div className="service__card__item__btn">
              <button onClick={() => handlePremium(item.slug, "premium")}>
                Chấp nhận
              </button>
              <button
                className="refuse"
                onClick={() => handlePremium(item.slug, "regular")}
              >
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <ModalTitle fnClose={() => setModalOpen(false)}>
            <h4>Tạo thông báo mới</h4>
          </ModalTitle>
          <ModalBody>
            <div className="service__notifi">
              <textarea
                type="text"
                id="notifi"
                placeholder="Nhập nội dung"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="cancel-btn"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Hủy
            </button>
            <button
              className="ok-btn"
              onClick={() => {
                handleNotifi();
                setModalOpen(false);
              }}
            >
              Tạo
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default Service;
