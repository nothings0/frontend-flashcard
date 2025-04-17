import { useSelector } from "react-redux";
// import ContactList from "./components/ContactList";
import Notification from "./components/Notification";
import PremiumRequests from "./components/PremiumRequests";
import BannerManager from "./components/Banner";

const Service = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  return (
    <div className="service">
      {/* <ContactList accessToken={accessToken} /> */}
      <div className="service__left">
        <Notification accessToken={accessToken} />
      </div>
      <div className="service__right">
        <BannerManager accessToken={accessToken}/>
      <PremiumRequests accessToken={accessToken} />
      </div>
    </div>
  );
};

export default Service;