import { useState, useEffect } from "react";
import { GetContact } from "../../redux/apiRequest";

const ContactList = ({ accessToken }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await GetContact(accessToken);
      setContacts(res?.data || []);
    };
    fetchContacts();
  }, [accessToken]);

  return (
    <div className="service__section service__contacts">
      <h2 className="service__title">Liên hệ từ người dùng</h2>
      {contacts.length > 0 ? (
        contacts.map((item, index) => (
          <div key={index} className="contact-item">
            <p>
              <strong>Tiêu đề:</strong> {item.title}
            </p>
            <p>
              <strong>Email:</strong> {item.email}
            </p>
            <p>
              <strong>Mô tả:</strong> {item.description}
            </p>
          </div>
        ))
      ) : (
        <p className="service__empty">Không có email cần xử lý.</p>
      )}
    </div>
  );
};

export default ContactList;