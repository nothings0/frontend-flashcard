import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllCard,
  UpdateCardAdmin,
  AdminAddCard,
  AdminDeleteCard,
} from "../redux/apiRequest";
import Modal, { ModalTitle, ModalBody, ModalFooter } from "../components/Modal";
import List from "./components/List";
import debounce from "lodash/debounce";
import CardModal from "./components/CardModal";
import dayjs from "dayjs";

const Card = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [editingCard, setEditingCard] = useState(null);
  const [deletingCard, setDeletingCard] = useState(null);

  const dispatch = useDispatch();

  const limit = 10;
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  useEffect(() => {
    const handler = debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 500);
    handler(searchInput);
    return () => handler.cancel();
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GetAllCard({ page, limit, search, accessToken });
      setCards(res.cards || []);
      setTotal(res.totalPages || 0);
    };

    if (accessToken) fetchData();
  }, [page, search, accessToken]);

  const handleSaveCard = async (card) => {
    try {
      if (card._id) {
        await UpdateCardAdmin({ data: card, accessToken });
      } else {
        await AdminAddCard({ data: card, accessToken });
      }
      const res = await GetAllCard({ page, limit, search, accessToken });
      setCards(res.cards || []);
      setTotal(res.totalPages || 0);
      setEditingCard(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCard = async (id) => {
    await AdminDeleteCard(id, accessToken, dispatch);
    const res = await GetAllCard({ page, limit, search, accessToken });
    setCards(res.cards || []);
    setTotal(res.totalPages || 0);
    setDeletingCard(null);
  };

  return (
    <>
      <div className="header-title">
        <h1>Quản lý học phần</h1>
        <div className="header-control">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm thẻ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <i
              className={`fa-solid fa-magnifying-glass search-icon ${
                searchInput ? "" : "disable"
              }`}
            ></i>
          </div>
          <button onClick={() => setEditingCard({})}>Thêm thẻ</button>
        </div>
      </div>

      <List
        data={cards}
        currentPage={page}
        total={total}
        limit={limit}
        columns={["title", "type", "views", "createdAt"]}
        onPageChange={setPage}
        onEdit={setEditingCard}
        onDelete={setDeletingCard}
        customRender={{
          createdAt: (val) => dayjs(val).format("DD/MM/YYYY"),
          type: (val) => <span className={`badge badge-${val}`}>{val}</span>,
        }}
      />

      {deletingCard && (
        <Modal modalOpen={true} setModalOpen={() => setDeletingCard(null)}>
          <ModalTitle fnClose={() => setDeletingCard(null)}>
            Xác nhận xoá
          </ModalTitle>
          <ModalBody>
            <p>
              Bạn có chắc muốn xoá thẻ{" "}
              <strong className="highlight">{deletingCard.title}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => setDeletingCard(null)}
              className="cancle-btn"
            >
              Huỷ
            </button>
            <button
              onClick={() => handleDeleteCard(deletingCard._id)}
              className="delete-btn"
            >
              Xoá
            </button>
          </ModalFooter>
        </Modal>
      )}

      {editingCard && (
        <CardModal
          card={editingCard}
          setModalOpen={() => setEditingCard(null)}
          handleSaveCard={handleSaveCard}
        />
      )}
    </>
  );
};

export default Card;
