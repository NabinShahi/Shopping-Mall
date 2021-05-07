import React, { useEffect, useState } from "react";
import Button from "../components/Button/Button"
import '../components/HeaderInfo/HeaderInfo';
import DashboardItem from "../components/DashboardItem/DashBoardItem";
import "./MallInfo.css";
import { findMall } from "../firebase/firebase";
import HeaderInfo from "../components/HeaderInfo/HeaderInfo"

function MallInfo({ history, match }) {
  const { mallId } = match.params;
  const [mall, setMall] = useState({});
  const [loading, setLoading] = useState(true);

  const { mallName, mallAddress, shops } = mall;

  useEffect(() => {
    const mallFinder = async () => {
      try {
        const mall = await findMall(mallId);
        if (mall.exists) {
          // console.log(mall.data(), mall.id);
          setMall({ ...mall.data() });
        } else {
          console.log("Mall not found.")
        }
      } catch (error) {
        console.log("error", error)
      } finally {
        setLoading(false);
      }
    };
    mallFinder();
    return mallFinder;
  }, [mallId]);

  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <div className="mallInfo">
          <HeaderInfo title={mallName} subTitle={mallAddress}/>

          <div className="mallInfo__addButton">
            <Button
              type="button"
              text="Add Shop"
              disabled={false}
              onClick={() => history.push(`/mall/add-shop/${mallId}`)}
            />
          </div>
          <DashboardItem data={shops} title="Shop" titleId={mallId} />
          <div className="mallInfo__shopButton">
            <Button
              type="button"
              text="Edit Mall"
              disabled={false}
              // onClick={()=>history.push(`editmall/${mallId}`)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MallInfo;
