import React, { useEffect, useState } from "react";
import Define from "./Define";
import HeaderPrimary from "../../components/HeaderPrimary";
import Choice from "./Choice";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { GetProLearn } from "../../redux/apiRequest";
import { useSelector } from "react-redux";
import Write from "./Write";
import Skeleton from "../../components/Skeleton";

const ProLearn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { slug } = useParams();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  useEffect(() => {
    if (!accessToken) navigate("/login");
  });

  const { data, isLoading } = useQuery({
    queryFn: () => GetProLearn(slug, accessToken),
    queryKey: "data-pro",
    staleTime: Infinity,
  });

  if (isLoading) return <Skeleton />;

  return (
    <div className="pro-learn">
      <HeaderPrimary title="Học tập" />
      <>
        {step === 1 && <Define data={data} setStep={setStep} />}
        {step === 2 && <Choice data={data} setStep={setStep} />}
        {step === 3 && <Write data={data} setStep={setStep} />}
      </>
    </div>
  );
};

export default ProLearn;
