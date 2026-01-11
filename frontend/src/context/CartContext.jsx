import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import apiService from "../api/apiService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load cart from backend on initial load and when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        setLoading(false);
        setError(null);
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get("/cart");
        if (response.data?.items) {
          setCart([...response.data.items]);
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        if (err.response?.status === 404) {
          // If cart not found, it's not an error - just empty cart
          setCart([]);
          setError(null);
        } else {
          setError("Failed to load cart");
          setCart([]);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    try {
      if (!user) {
        toast.error("Please login to add items to cart");
        return;
      }

      if (!product || !product._id) {
        throw new Error("Invalid product data");
      }

      // ✅ ADD THIS BLOCK HERE
      if (
        !product.selectedWeight ||
        !product.unitPrice ||
        !product.totalPrice
      ) {
        toast.error("Please select weight before adding to cart");
        return;
      }

      // THEN CONTINUE
      const cartItem = {
        productId: product._id,
        selectedWeight: product.selectedWeight,
        quantity: product.quantity || 1,
        unitPrice: product.unitPrice,
        totalPrice: product.totalPrice,

        product: {
          _id: product._id,
          name: product.name,
          images: Array.isArray(product.images) ? product.images : [],
          discount: product.discount || 0,
        },
      };

      console.log("Adding to cart:", cartItem);
      const response = await apiService.post("/cart/items", cartItem);

      if (response.data?.items) {
        setCart([...response.data.items]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const removeFromCart = async (itemId) => {
  try {
    setLoading(true);

    const response = await apiService.delete(`/cart/items/${itemId}`);

    // ✅ FORCE new array reference
    setCart([...response.data.items]);

    toast.success("Item removed from cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove from cart");
  } finally {
    setLoading(false);
  }
};



  const updateQuantity = async (itemId, quantity) => {
    try {
      if (!itemId) {
        throw new Error("Cart item ID is required");
      }

      const response = await apiService.patch(`/cart/items/${itemId}`, {
        quantity,
      });

      if (response.data?.items) {
        setCart([...response.data.items]);
        toast.success("Quantity updated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.error || "Failed to update quantity");
    }
  };

 const clearCart = async () => {
  try {
    setLoading(true);
    setError(null);

    await apiService.delete("/cart");

    // ✅ cart is empty, no need to refetch
    setCart([]);

    toast.success("Cart cleared successfully");
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error(error.response?.data?.error || "Failed to clear cart");
  } finally {
    setLoading(false);
  }
};

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (Number(item.totalPrice) || 0);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
  value={{
    cart,
    setCart, // 👈 ADD THIS
    loading,
    error,
    initialized,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }}
>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
