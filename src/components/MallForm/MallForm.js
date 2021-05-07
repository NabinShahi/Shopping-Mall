import { TextField } from "@material-ui/core";
import "./MallForm.css";
import React, { useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { db, storage } from "../../firebase/firebase";
import Button from "../Button/Button";
import ShopForm from "../ShopForm/ShopForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid } from "uuid";
import { withRouter } from "react-router";
import { resetShopImages } from "../../redux/shopImageSlice";

const schema = yup.object().shape({
  mallName: yup.string().required(),
  mallAddress: yup.string().required(),
});

function MallForm({ mallData, history, type }) {
  const [mallImage, setMallImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    initialValues: { ...mallData },
  });
  const { control, reset } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: "shops",
  });
  const imageState = useSelector(
    (state) => state.shopImageReducer,
    shallowEqual
  );
  const dispatch = useDispatch();
  const handleMallImageChange = (event) => {
    setMallImage(event.target.files[0]);
  };
  const onSubmit = async (data) => {
    setIsLoading(true);
    if (type === "Add") {
      try {
        await storage.ref(mallImage.name).put(mallImage);

        await Promise.all(
          imageState.images.map((photo) =>
            Promise.all(
              photo.images.map((image) => storage.ref(image.name).put(image))
            )
          )
        );
        const mallUrl = await storage.ref(mallImage.name).getDownloadURL();

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

        data.mallImage = {
          imageName: mallImage.name,
          imageUrl: mallUrl,
        };

        await db.collection("mall").add(data);
        reset();
        setMallImage(null);
        dispatch(resetShopImages());
        history.push("/dashboard");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else if (type === "Edit") {
      setIsLoading(false);
      try {
        if (mallImage) {
          await storage.ref(mallImage.name).put(mallImage);
          storage.ref(data.mallImage.imageName).delete();
          const mallUrl = await storage.ref(mallImage.name).getDownloadURL();
          data.mallImage = {
            imageName: mallImage.name,
            imageUrl: mallUrl,
          };
        }
        if (imageState.images.length) {
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
          const arrangedUrl = url.map((index) => ({
            id: imageState.images[index].id,
            url: url[index],
          }));

          data.shops = arrangedUrl.map((u, i) =>
            data.shops.map((shop, index) =>
              u.id === index
                ? {
                    ...shop,
                    id: mallData.shops[index].id,
                    shopImages: [
                      ...mallData.shops[index].shopsImages,
                      ...arrangedUrl[i].url,
                    ],
                  }
                : {
                    ...shop,
                    id: mallData.shops[index].id,
                    shopImages: [...mallData.shops[index].shopsImages],
                  }
            )
          );
          console.log(data);
        }
      } catch (error) {
        console.log("Error Object", error);
      }
    }
  };

  return (
    <div className="mallForm">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Controller
            control={methods.control}
            name="Mall Name"
            render={({ field }) => (
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Mall Name"
                error={!methods.formState.errors.mallName}
                {...field}
              />
            )}
          />
          <Controller
            control={methods.control}
            name="Mall Address"
            render={({ field }) => (
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Mall Address"
                error={!methods.formState.errors.mallAddress}
                {...field}
              />
            )}
          />

          <input type="file" onChange={handleMallImageChange} />
          <br />
          <b>Add Shop</b>
          {fields.map((field, index) => (
            <ShopForm shop={field} index={index} id={field.id} type={type} />
          ))}
          {type === "Add" && (
            <Button
              text="Add More Shops"
              type="button"
              onClick={() => {
                append({ shopName: "", shopImages: [], shopDetail: "" });
              }}
            />
          )}
          <br />
          <Button
            text={isLoading ? "Saving" : `${type}`}
            type="submit"
            disabled={isLoading}
          />
        </form>
      </FormProvider>
    </div>
  );
}

export default withRouter(MallForm);
