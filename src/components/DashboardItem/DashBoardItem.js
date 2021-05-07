import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { withRouter } from "react-router";
import Card from "../Card/Card";
import { allImagesFromMall } from "../../services/allImagesFromMall";
 
import {
  deleteMall,
  deleteShopFromMall,
  removeMallImages,
  removeShopImageFromMallShop,
} from "../../firebase/firebase";
import "./DashBoardItems.css";

function DashBoardItem({ title, history, data, titleId, role }) {
  const allMallsFromStore = useSelector(
    (state) => state.allMallsReducer,
    shallowEqual
  );

  const onClick = (ids, mallId) => {
    role === "admin"
      ? history.push(`/admin/shop-detail/${titleId || mallId}/${ids}`)
      : history.push(`/shop-detail/${titleId || mallId}/${ids}`);
  };

  const onClickMallDetail = (mallId) => {
    role === "admin"
      ? history.push(`/admin/mall-detail/${mallId}`)
      : history.push(`/mall-detail/${mallId}`);
  };

  const handleRemoveCard = (event, mallId) => {
    const mallToBeDeleted = data.find((mall) => mall.id === mallId);
    deleteMall(mallId)
      .then((res) => {
        const allImg = allImagesFromMall(mallToBeDeleted);
        removeMallImages(allImg);
      })
      .catch((error) => console.log("error", error));
    event.stopPropagation();
  };

  const handleRemoveCardShop = (event, shopId, mallId) => {
    const mallIdentity = mallId || titleId;
    const mall = allMallsFromStore.malls.find(
      (item) => item.id === mallIdentity
    );
    // console.log("object", mall, mallIdentity, shopId);
    const shopToBeDeleted = mall.shops.find((shop) => shop.id === shopId);
    const allImagesFromShop = shopToBeDeleted.shopsImages.map(
      (item) => item.urlName
    );
    const newShop = mall.shops.filter((shop) => shop.id !== shopId);

    deleteShopFromMall(mallIdentity, newShop)
      .then((res) => {
        removeShopImageFromMallShop(allImagesFromShop);
      })
      .catch((error) => console.log("error", error));
    event.stopPropagation();
  };
  return (
    <div className="dashboard-item-container">
      <h3>{title}</h3>
      <div className="item-image-container">
        {title === "Shops" &&
          data?.map(({ id, shopName, shopsImages, mallId } = {}) => (
            <Card
              key={id}
              onClickDetail={onClick}
              heading={shopName}
              image={shopsImages && shopsImages[0]?.url}
              id={id}
              mallId={mallId}
              handleRemoveCard={(e) => handleRemoveCardShop(e, id, mallId)}
            />
          ))}
        {title === "Malls" &&
          data?.map((mall) => (
            <Card
              key={mall.id}
              heading={mall.mallName}
              subHeading={mall.mallAddress}
              image={mall.mallImage.imageUrl}
              id={mall.id}
              onClickDetail={() => onClickMallDetail(mall.id)}
              handleRemoveCard={(e) => handleRemoveCard(e, mall.id)}
            />
          ))}
      </div>
    </div>
  );
}

DashBoardItem.defaultProps = {
  role: "user",
};

export default withRouter(DashBoardItem);
