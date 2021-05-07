import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import Button from "../components/Button/Button";
import ShopForm from "../components/ShopForm/ShopForm";
import { db, storage } from "../firebase/firebase";
import { resetShopImages } from "../redux/shopImageSlice";
import { v4 as uuid } from "uuid";

function AddShop({ match, history }) {
  const methods = useForm({
    shops: [{ shopName: "", shopDetail: "", shopImages: [] }],
  });
  const { control, handleSubmit, reset, formState: {errors}, } = methods;
  const { fields, append } = useFieldArray({
    name: "shops",
    control,
  });
  const [oldShops, setOldShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mallName, setMallName] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const imageState = useSelector(
    (state) => state.shopImageReducer,
    shallowEqual
  );
  const dispatch = useDispatch();
  const { mallId } = match?.params;

  useEffect(() => {
    storage
      .collection("mall")
      .doc(mallId)
      .get.then((doc) => {
        if (doc.exists) {
          // console.log("Document Found");
          setOldShops(doc.data().shops);
          // console.log(doc.data().shops);
          setMallName(doc.data().mallName);
        } else {
          console.log("No Document found");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      })
      .finally(() => setIsLoading(false));
  }, [mallId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await Promise.all(
        imageState.images.map((photo) =>
          Promise.all(
            photo.images.map((image) => storage.ref(image.name).put(image))
          )
        )
      );

      const url = await Promise.all(
        imageState.images.map((photo) =>
          Promise.all(
            photo.images.map((image) =>
              storage.ref(image.name).getDownloadURL()
            )
          )
        )
      );

      data.shops = data.shops.map((item, i) => ({
        id: uuid(),
        ...item,
        shopsImages: url[i].map((items, index) => ({
          url: items,
          urlName: imageState.images[i].images[index].name,
        })),
      }));

      await db
        .collection("mall")
        .doc(match.params.mallId)
        .update({ shops: [...data.shops, ...oldShops] });

      reset();
      dispatch(resetShopImages());
      history.push("/mall-info");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <ShopForm key={field.id} index={index} shop={field} />
          ))}
          <Button
            text="Add More Shops"
            type="Button"
            onClick={() => {
              append({ shopName: "", shopDetail: "", shopImages: [] });
            }}
          />
          <Button
            type="submit"
            disabled={isLoading}
            text={isLoading ? "Saving" : "Add Shops"}
          />
        </form>
      </FormProvider>
    </div>
  );
}

export default withRouter(AddShop);
