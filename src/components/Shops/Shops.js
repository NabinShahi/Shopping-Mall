import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import LazyLoad from "react-lazy-load";
import Card from "../Card/Card";
import Search from "../Search/Search";
import {
  deleteShopFromMall,
  findMalls,
} from "../../firebase/firebase";
import { removeShopImageFromMallShop } from "../../firebase/firebase";;
import Loading from "../Loading/Loading";
import Card from "../Card/Card";
import Search from "../Search/Search";
import "./AllShop.css";

function AllShops({ history, role }) {
  const [loading, setLoading] = useState(true);
  const [allShops, setAllShops] = useState([]);
  const [allMalls, setAllMalls] = useState([]);

  const [filteredShops, setFilteredShops] = useState([]);
  console.log(filteredShops);

  const handleSearchShopChange = (e) => {
    if (e.target.value) {
      const re = new RegExp(e.target.value, "gi");
      const filteredMalls = allShops.filter((shop) => shop.shopName.match(re));
      setFilteredShops(filteredMalls);
    } else setFilteredShops(allShops);
  };

  useEffect(() => {
    findMalls()
      .then((snapShot) => {
        let mallsDoc = [];
        snapShot.forEach((snap) => {
          mallsDoc.push({ id: snap.id, shops: snap.data().shops });
        });
        setAllMalls(mallsDoc);
        const allShops = mallsDoc.reduce((shopArr, mall) => {
          const oneMallShops = mall.shops.reduce((shop, item) => {
            shop.push({ ...item, mallId: mall.id });
            return shop;
          }, []);
          shopArr = [...shopArr, ...oneMallShops];
          return shopArr;
        }, []);

        setFilteredShops(allShops);
        setAllShops(allShops);
      })
      .catch((err) => console.log("error", err))
      .finally(() => setLoading(false));
  }, []);
  const onClickDetail = (mallId, shopId) => {
    role === "admin"
      ? history.push(`/admin/shop-info/${mallId}/${shopId}`)
      : history.push(`/shop-info/${mallId}/${shopId}`);
  };

  const handleRemoveCardShop = (e, mallId, shopId) => {
    const shopToBeDeleted = allShops.find((shop) => shop.id === shopId);
    const shopAllImages = shopToBeDeleted.shopsImages.map(
      (item) => item.urlName
    );
    const { shops } = allMalls.find((mall) => mall.id === mallId);
    const newShops = shops.filter((shop) => shop.id !== shopId);

    deleteShopFromMall(mallId, newShops)
      .then((res) => {
        removeShopImageFromMallShop(shopAllImages);
        setFilteredShops([...allShops.filter((shop) => shop.id !== shopId)]);
        setAllShops([...allShops.filter((shop) => shop.id !== shopId)]);
      })
      .catch((error) => console.log("could not delete shops", error));
      e.stopPropagation();
    };

  return (
    <div className="all-shop-container">
      <div className="search-all-shop">
        <Search
          placeHolder="Search Shops..."
          onChange={handleSearchShopChange}
        />
      </div>
      <div className="shop-list">
        <p className="shops-title">Shops</p>
        <div className="all-shop-list">
          {loading ? (
            <Loading />
          ) : filteredShops?.length ? (
            filteredShops?.map((shop) => (
              <LazyLoad key={shop.id} height={350} offsetHorizontal={50}>
                <Card
                  image={shop.shopsImages[0].url}
                  heading={shop.shopName}
                  id={shop.id}
                  mallId={shop.mallId}
                  onClickDetail={() => onClickDetail(shop.mallId, shop.id)}
                  handleRemoveCard={(e) =>
                    handleRemoveCardShop(e, shop.mallId, shop.id)
                  }
                />
              </LazyLoad>
            ))
          ) : (
            "No any shop to show"
          )}
        </div>
      </div>
    </div>
  );
}

AllShops.defaultProps = {
  role: "user",
};

export default withRouter(AllShops);
