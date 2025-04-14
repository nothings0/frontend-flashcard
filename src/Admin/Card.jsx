import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetAllCard } from '../redux/apiRequest';
import Modal, { ModalTitle, ModalBody, ModalFooter } from '../components/Modal';
import List from './List';

const Card = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingCard, setEditingCard] = useState(null);
  const [deletingCard, setDeletingCard] = useState(null);
  const limit = 10;

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  useEffect(() => {
    const getData = async () => {
      const res = await GetAllCard({ page, limit, accessToken });
      console.log(res);
      
      setCards(res.cards || []);
      setTotal(res.totalPages || 0);
    };
    if (accessToken) getData();
  }, [page, accessToken]);

  const handleSaveCard = async (card) => {
    console.log('Saving card', card);
  };

  const handleDeleteCard = async (cardId) => {
    console.log('Deleting card', cardId);
  };

  return (
    <>
      <div className="header-title">
        <h1>Quản lý thẻ học tập</h1>
        <button onClick={() => setEditingCard({})}>Thêm thẻ</button>
      </div>

      <List
        data={cards}
        currentPage={page}
        total={total}
        limit={limit}
        columns={['title', 'views', 'type', 'user.username']}
        onPageChange={setPage}
        onEdit={setEditingCard}
        onDelete={setDeletingCard}
        customRender={{
          isAdmin: (val) => (val ? '✔️' : '❌'),
          plan: (val) => val?.type || 'N/A',
        }}
      />

      {deletingCard && (
        <Modal modalOpen={true} setModalOpen={() => setDeletingCard(null)}>
          <ModalTitle fnClose={() => setDeletingCard(null)}>
            Xác nhận xoá
          </ModalTitle>
          <ModalBody>
            <p>
              Bạn có chắc muốn xoá card{' '}
              <strong>{deletingCard.cardname}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => handleDeleteCard(deletingCard._id)}>
              Xoá
            </button>
            <button onClick={() => setDeletingCard(null)}>Huỷ</button>
          </ModalFooter>
        </Modal>
      )}

      {editingCard && (
        <Modal modalOpen={true} setModalOpen={() => setEditingCard(null)}>
          <ModalTitle fnClose={() => setEditingCard(null)}>
            {editingCard._id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          </ModalTitle>
          <ModalBody>
            {/* Form chỉnh sửa hoặc thêm card */}
            <p>Coming soon...</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => handleSaveCard(editingCard)}>Lưu</button>
            <button onClick={() => setEditingCard(null)}>Huỷ</button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default Card;
