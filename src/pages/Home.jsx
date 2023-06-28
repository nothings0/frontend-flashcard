import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import List from "../components/List";
import { GetHome } from "../redux/apiRequest";
import Skeleton from "../components/Skeleton";
import Footer from "../components/Footer";
import HomeTop from "../components/HomeTop";
import { useQuery } from "react-query";
// import GoogleAds from '../components/GoogleAds';

const Home = () => {
  const [recentCard, setRecentCard] = useState({});
  const userId = useSelector((state) => state.user.currentUser?.user._id);

  const { data, isLoading } = useQuery({
    queryFn: () => GetHome(8, userId),
    queryKey: "data-home",
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const suggestList = data?.suggestCards;
    const recentCard = JSON.parse(localStorage.getItem("recent"));
    setRecentCard(recentCard);
    // const dataList = {
    //   ...res,
    //   recentCard: { data: recentCard, title: "Gần đây" },
    // };
    localStorage.setItem("suggestList", JSON.stringify(suggestList));
  }, [data]);

  return (
    <Helmet title="Trang chủ | Flux">
      <div className="home">
        <Search />
        <HomeTop />
        <div className="home__left">
          {isLoading ? (
            <Skeleton type="feed" />
          ) : (
            <>
              <List
                title={data.populateCards.title}
                data={data.populateCards.data}
                type="trend"
              />
              <List
                title={data.suggestCards.title}
                data={data.suggestCards.data}
                type="suggest"
              />
              <List
                title={data.rateCards.title}
                data={data.rateCards.data}
                type="rate"
              />
              {/* <GoogleAds type="ngang" /> */}
              <List
                title={data.cardSaveds.title}
                data={data.cardSaveds.data}
                type="saved"
              />
              <List title="Gần đây" data={recentCard?.data} type="recent" />
            </>
          )}
          <Footer />
        </div>
      </div>
    </Helmet>
  );
};

export default Home;
