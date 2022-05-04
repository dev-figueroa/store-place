import { useState } from 'react';
import { useQuery } from 'react-query';
// components
import Item from './Item/Item'
import Cart from './Cart/Cart';
import Drawer from '@mui/material/Drawer';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Badge from '@mui/material/Badge';
// styles
import { Wrapper, StyledButton } from './App.styles';
// types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};


const getProducts = async (): Promise<CartItemType[]> => 
  await (await fetch('https://fakestoreapi.com/products')).json();

 const App = () => {
  const [ cartOpen, setCartOpen ] = useState(false);
  const [ cartItems, setCartItems ] = useState([] as CartItemType[]); 
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products', 
    getProducts
  );
  console.log(data);
  //console.log(error);

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack:number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // check if exist
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if (isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id 
          ? { ...item, amount: item.amount + 1 }
          : item
        ))
      };
      // first time is added
      return [ ...prev, { ...clickedItem, amount: 1 }]
    });
  };
   
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if(item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }]
        }else {
         return [...ack, item];
        }
      },[] as CartItemType[])
    ))
  };
   
  if (isLoading) return <LinearProgress />;
  if(error) return <div>Something went wrong ...</div>
  
  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={ () => setCartOpen(false) }>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCart}>
        </Cart>
      </Drawer>
      <StyledButton onClick={ () => setCartOpen(true) }>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon></AddShoppingCartIcon>
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} ></Item>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;