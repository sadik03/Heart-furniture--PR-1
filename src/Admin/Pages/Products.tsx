import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import AdminNavbar from "../Components/Admin-Navbar";
import { getProducts } from "../../UserPage/Redux/Admin/action";
import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import AdminProductCard from "../Components/Admin_product_card";
import axios from "axios";
import { ProductURL } from "../../UserPage/Utilis/api";

// Define your state type for the component
interface AppState {
  adminReducer: {
    products: any[];
    isLoading: boolean;
    isError: boolean;
  };
}

const Products: React.FC = () => {
  const dispatch = useDispatch<Dispatch<ThunkAction<void, AppState, null, Action<string>>>>();
  const { products } = useSelector((state: AppState) => ({
    products: state.adminReducer.products,
    isLoading: state.adminReducer.isLoading,
    isError: state.adminReducer.isError,
  }));

  const initProduct = {
    name: "",
    category: "",
    price: "",
    image: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    rating: "",
    about: "",
    reviews: [
      {
        username: "Sarah123",
        rating: 5,
        comment: "I love this dining table! It's beautiful and sturdy.",
      },
      {
        username: "JohnDoe45",
        rating: 4,
        comment: "Great value for a modern dining table.",
      },
      {
        username: "ElegantHome",
        rating: 5,
        comment: "I'm very pleased with this purchase. It's perfect.",
      },
      {
        username: "FurnitureFanatic",
        rating: 4,
        comment: "Assembly was straightforward, but it took some time.",
      },
    ],
  };

  let [newProduct, setNewProduct] = useState(initProduct);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.name === "price" || e.target.name === "rating" ? parseFloat(e.target.value) : e.target.value;
    setNewProduct({
      ...newProduct,
      [e.target.name]: value,
    });
  };

  const AddProduct = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const response = await axios.post(ProductURL, newProduct);
      console.log('Response:', response.data);
      dispatch(getProducts());
      setNewProduct(initProduct);
    } catch (error) {
      console.error('Error posting new product:', error);
    }
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <AdminNavbar />
      <Box display={"flex"} justifyContent={"space-around"}>
        <Box w={"20%"}>
          <Stack spacing={4}>
            <Text textAlign={"center"} fontWeight={"bold"} mb={2} fontSize={"25"} color={"#0b3954"}>ADD NEW PRODUCT</Text>
            {Object.entries(initProduct).filter(([key]) => key !== "reviews").map(([key, value]) => (
              <Input
                key={key}
                variant="filled"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                type={key === "price" || key === "rating" ? "number" : "text"}
                name={key}
                value={newProduct[key]}
                onChange={handleChange}
              />
            ))}
            <Button bg={"#0b3954"} m={"20px 5px"} color={"white"} _hover={{ bg: "#e89f22" }} onClick={AddProduct}>
              ADD PRODUCT
            </Button>
          </Stack>
        </Box>
        <Box w={"70%"}>
          <SimpleGrid spacing={10} columns={[1, 2, 3]} w={"100%"}>
            {products?.map(product => (
              <AdminProductCard key={product.id} {...product} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

export default Products;
