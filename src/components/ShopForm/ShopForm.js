import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./ShopForm.css";
import { addShopImages, deleteShopImages } from "../../redux/shopImageSlice";

function ShopForm({ shop, index, id, type }) {
  const { register } = useForm();
  const dispatch = useDispatch();
  const imageState = useSelector(
    (state) => state.shopImageReducer,
    shallowEqual
  );

  const handleFileChange = (event, id) => {
    const { files } = event.target;
    dispatch(addShopImages({ id: id, images: [...files] }));
  };

  const handleImageRemove = (index, filename) => {
    dispatch(deleteShopImages({ index, filename }));
  };
  return (
    <React.Fragment>
      <div className="shopForm">
        <input
          type="text"
          placeholder="Enter Shop Name"
          {...register("shopName", { required: true })}
        />
        <textarea
          rows="4"
          cols="50"
          name="comment"
          placeholder="Enter Details Here..."
          {...register("shopDetails", { required: true })}
        />
        <input
          type="file"
          onChange={(event) => handleFileChange(event, index)}
          multiple
        />
        {type === "Add" && <strong>First will be Thumbnail</strong>}
        {/* {imageState.images[index].images.map((file, index) => {
          return (
            <div key={index} className="image-detail-action">
              <p>{file.name}</p>
              <p
                className="image-delete-action"
                onClick={() => handleImageRemove(index, file.name)}
              >
                X
              </p>
            </div>
          );
        })} */}
      </div>
    </React.Fragment>
  );
}

export default ShopForm;
