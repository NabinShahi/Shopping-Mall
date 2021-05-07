import React, { useEffect, useState } from "react";
import Search from "../Search/Search";
import Button from "../Button/Button";
import Card from "../Card/Card";
import { removeMallImages } from "../../firebase/firebase";
import {
  deleteMall,
  findMalls,
} from "../../firebase/firebase";
import Loading from "../Loading/Loading";
import {allImagesFromMall} from "../../services/allImagesFromMall";
import { withRouter } from "react-router";
import "./Malls.css";

function Malls({ history, role, match }) {
  const [malls, setMalls] = useState([]);
  const [filterMalls, setFilterMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  const handleSearchChange = (e) => {
    if (e.target.value) {
      const re = new RegExp(e.target.value, "gi");
      const filteredMalls = malls.filter((mall) => mall.mallName.match(re));
      setFilterMalls(filteredMalls);
    } else setFilterMalls(malls);
  };

  useEffect(() => {
    findMalls()
      .then((snapShot) => {
        let mallsDoc = [];
        snapShot.forEach((snap) => {
          mallsDoc.push({ id: snap.id, ...snap.data() });
        });
        setMalls(mallsDoc);
        setFilterMalls(mallsDoc);
      })
      .catch((err) => console.log("error", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveCardMall = (e, mallId) => {
    const mallToBeDeleted = malls.find((mall) => mall.id === mallId);
    deleteMall(mallId)
      .then((res) => {
        const allImg = allImagesFromMall(mallToBeDeleted);
        removeMallImages(allImg);
        setMalls([...malls.filter((mall) => mall.id !== mallId)]);
        setFilterMalls([...malls.filter((mall) => mall.id !== mallId)]);
      })
      .catch((error) => console.log("could not delete try again", error));
    e.stopPropagation();
  };


  return (
    <div className="admin-all-malls">
      <div className="search-comp">
        <Search placeHolder="Search Malls" onChange={handleSearchChange} />
      </div>
      {isAdmin && (
        <div className="add-new-mall-btn">
          <Button
            type="button"
            text="Add New Mall"
            onClick={() => history.push("/admin/add-mall")}
            disabled={false}
          />
        </div>
      )}

      <div className="allmall__heading">
        <p> Malls</p>
      </div>
      <div className="mall__list">
        {loading ? (
          <Loading />
        ) : filterMalls.length ? (
          filterMalls.map((mall) => (
            <div key={mall.id}>
              <Card
                image={mall.mallImage.imageUrl}
                heading={mall.mallName}
                subHeading={mall.mallAddress}
                onClickDetail={() =>
                  role === "admin"
                    ? history.push(`/admin/mall-info/${mall.id}`)
                    : history.push(`/mall-info/${mall.id}`)
                }
                handleRemoveCard={(e) => handleRemoveCardMall(e, mall.id)}
              />
            </div>
          ))
        ) : (
          <h3>No any data to show</h3>
        )}
      </div>
    </div>
  );
}

Malls.defaultProps = {
  role: "user",
};

export default withRouter(Malls);
