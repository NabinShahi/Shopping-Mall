import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router";
import Button from "../Button/Button";
import Search from "../Search/Search";
import "./Dashboard.css";
import { findMalls } from "../../firebase/firebase";
import NavbarAdmin from "../NavbarAdmin/NavbarAdmin";
import DashboardItem from "../DashboardItem/DashBoardItem";
import { useDispatch } from "react-redux";
import Loading from "../Loading/Loading";
import DashBoardItem from "../DashboardItem/DashBoardItem"
import { getAllMalls } from "../../redux/mallsSlice";

function Dashboard({ match, history, role }) {
  const [stateMall, setStateMall] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [filteredMall, setStateFilteredMall] = useState([]);

  const dispatch = useDispatch();

  // let history = useHistory();

  const handleSearchChange = (event) => {
    if (event.target.value) {
      const re = new RegExp(event.target.value, "gi");
      const filteredMalls = stateMall.filter((mall) => mall.mallName.match(re));
      setStateFilteredMall(
        filteredMalls.slice(
          filteredMalls.length > 3 ? filteredMalls.length - 3 : filteredMalls
        )
      );
    } else setStateFilteredMall(stateMall.slice(stateMall.length - 3));
  };

  const shopFiltered = filteredMall.reduce((arr, item) => {
    arr.push({ ...item.shops[0], mallId: item.id });
    return arr;
  }, []);

  useEffect(() => {
    dispatch(getAllMalls())
    const mallFinder = async () => {
      try {
        const malls = await findMalls();
        const allMalls = [];
        malls.forEach((mall) => allMalls.push[{ id: mall.id, ...mall.data() }]);
        setStateMall(allMalls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    mallFinder();
    return () => mallFinder();
  }, [dispatch]);

  return (
    <React.Fragment>
      <NavbarAdmin />
      <div className="dashboard__searchMalls">
        <Search placeHolder="Search Mall ..." onChange={handleSearchChange} />
      </div>
      <div className="dashboard__container">
        {isAdmin && (
          <Button
            text="Add New Mall"
            onClick={() => history.push("/admin/add-mall")}
            type="button"
          />
        )}
        {isLoading ? (
          <Loading />
        ) : filteredMall.length ? (
          <>
            <DashboardItem title="Malls" data={filteredMall} role={role} />
            {filteredMall?.length > 2 ? (
              <div
                className="view-all"
                onClick={() =>
                  role === "admin"
                    ? history.push("/admin/malls")
                    : history.push("/all-mallsn ")
                }
              >
                <span>View All</span>
              </div>
            ) : (
              ""
            )}
            <DashBoardItem title="Shops" data={shopFiltered} role={role} />
            {shopFiltered?.length > 2 ? (
              <div className="view-all">
                <span
                  onClick={() =>
                    role === "admin"
                      ? history.push("/admin/admin-all-shops")
                      : history.push("/all-shops")
                  }
                >
                  View All
                </span>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          <h3>no data to show</h3>
        )}
      </div>
    </React.Fragment>
  );
}

export default withRouter(Dashboard);
