import React, { useEffect, useState } from "react";
import "./AdminShopsInfo.css";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import HeaderInfo from "../components/HeaderInfo/HeaderInfo";
import { findMall } from "../firebase/firebase";

function AdminShopDetail({ match, history }) {
  const { mallId, shopId } = match.params;
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const { shopName, shopDetail, shopsImages } = shop;

  useEffect(() => {
    const mallFinder = async () => {
      try {
        const mall = await findMall(mallId);
        if (mall.exists) {
          setShop(mall.data().shops.find((item) => item.id === shopId));
        } else {
          console.log("Items not found");
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    mallFinder();
    return mallFinder;
  }, [mallId, shopId]);
  return (
    <React.Fragment>
      {loading ? (
        "Loading..."
      ) : (
        <div className="shopDetails">
          <div className="shopDetails__header">
            <HeaderInfo title={shopName} subtitle={shopDetail} />
          </div>
          <Button
            type="button"
            text="Edit shop"
            onClick={() => history.push(`/`)}
            disabled={false}
          />
          <div className="shopDetails__images">
            {shopsImages.length
              ? shopsImages.map((img, index) => (
                  <Card image={img.url} key={index} />
                ))
              : "No Images Found"}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default AdminShopDetail;
