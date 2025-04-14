import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetAllUser } from '../redux/apiRequest';
import Modal, { ModalTitle, ModalBody, ModalFooter } from '../components/Modal';
import List from './List';

const User = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const limit = 10;

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  useEffect(() => {
    const getData = async () => {
      const res = await GetAllUser({ page, limit, accessToken });
      setUsers(res.users || []);
      setTotal(res.totalPages || 0);
    };
    if (accessToken) getData();
  }, [page, accessToken]);

  const handleSaveUser = async (user) => {
    console.log('Saving user', user);
  };

  const handleDeleteUser = async (userId) => {
    console.log('Deleting user', userId);
  };

  return (
    <>
      <div className="header-title">
        <h1>Quản lý người dùng</h1>
        <button onClick={() => setEditingUser({})}>Thêm người dùng</button>
      </div>

      <List
        data={users}
        currentPage={page}
        total={total}
        limit={limit}
        columns={['username', 'email', 'plan']}
        onPageChange={setPage}
        onEdit={setEditingUser}
        onDelete={setDeletingUser}
        customRender={{
          isAdmin: (val) => (val ? '✔️' : '❌'),
          plan: (val) => val?.type || 'N/A',
        }}
      />

      {deletingUser && (
        <Modal modalOpen={true} setModalOpen={() => setDeletingUser(null)}>
          <ModalTitle fnClose={() => setDeletingUser(null)}>
            Xác nhận xoá
          </ModalTitle>
          <ModalBody>
            <p>
              Bạn có chắc muốn xoá user{' '}
              <strong>{deletingUser.username}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => handleDeleteUser(deletingUser._id)}>
              Xoá
            </button>
            <button onClick={() => setDeletingUser(null)}>Huỷ</button>
          </ModalFooter>
        </Modal>
      )}

      {editingUser && (
        <Modal modalOpen={true} setModalOpen={() => setEditingUser(null)}>
          <ModalTitle fnClose={() => setEditingUser(null)}>
            {editingUser._id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          </ModalTitle>
          <ModalBody>
            {/* Form chỉnh sửa hoặc thêm user */}
            <p>Coming soon...</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => handleSaveUser(editingUser)}>Lưu</button>
            <button onClick={() => setEditingUser(null)}>Huỷ</button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default User;
