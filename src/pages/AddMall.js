import React from "react";
import MallForm from "../components/MallForm/MallForm";

function AddMall() {
  return (
    <div
      className="addMall"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Add Mall with Details</h2>
      <MallForm
        type="Add"
        mallData={{ mallName: "", mallAddress: "", mallImage: null, shops: [] }}
      />
    </div>
  );
}

export default AddMall;
