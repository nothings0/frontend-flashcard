import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetAllUser } from '../redux/apiRequest';
import Modal, { ModalTitle, ModalBody, ModalFooter } from '../components/Modal';
import List from './components/List';
import debounce from 'lodash/debounce';
import UserModal from './components/UserModal';
import { AdminAddUser, AdminUpdateUser } from '../redux/apiRequest';

const User = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

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
    const getData = async () => {
      const res = await GetAllUser({ page, limit, search, accessToken });
      setUsers(res.users || []);
      setTotal(res.totalPages || 0);
    };
    if (accessToken) getData();
  }, [page, search, accessToken]);

  const handleSaveUser = async (user) => {
    console.log("user to save:", user);
    try {
      if (user._id) {
        await AdminUpdateUser({ data: user, accessToken });
      } else {
        await AdminAddUser({ data: user, accessToken });
      }
      const res = await GetAllUser({ page, limit, search, accessToken });
      setUsers(res.users || []);
      setTotal(res.totalPages || 0);
  
      setEditingUser(null)
    } catch (error) {
      throw error
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('Deleting user', userId);
    setDeletingUser(null);
  };

  return (
    <>
      <div className="header-title">
        <h1>Quản lý người dùng</h1>
        <div className="header-control">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <i className={`fa-solid fa-magnifying-glass search-icon ${searchInput ? "" : "disable"}`}></i>
          </div>
          <button onClick={() => setEditingUser({})}>Thêm người dùng</button>
        </div>
      </div>

      <List
        data={users}
        currentPage={page}
        total={total}
        limit={limit}
        columns={['username', 'email', 'plan', 'isBlock']}
        onPageChange={setPage}
        onEdit={setEditingUser}
        onView={setEditingUser}
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
            <button onClick={() => setDeletingUser(null)} className='cancle-btn'>Huỷ</button>
            <button onClick={() => handleDeleteUser(deletingUser.username)} className='delete-btn'>
              Xoá
            </button>
          </ModalFooter>
        </Modal>
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          setModalOpen={() => setEditingUser(null)}
          handleSaveUser={handleSaveUser}
        />
      )}
    </>
  );
};

export default User;
