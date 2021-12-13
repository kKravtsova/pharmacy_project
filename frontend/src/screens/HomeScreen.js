import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';

function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const category = props.match.params.id ? props.match.params.id : '';
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
  }, [category]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  const sortHandler = (value) => {
    setSortOrder(value);
    dispatch(listProducts(category, searchKeyword, value));
  };

  return (
    <>
      {category && <h2 align='center'>{category}</h2>}

      <ul className='filter'>
        <li>
          <form onSubmit={submitHandler}>
            <input
              name='searchKeyword'
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type='submit'>Search</button>
          </form>
        </li>
        <li>
          Sort By{' '}
          <select
            name='sortOrder'
            onChange={(e) => sortHandler(e.target.value)}
          >
            <option value=''>Newest</option>
            <option value='lowest'>Lowest</option>
            <option value='highest'>Highest</option>
          </select>
        </li>
      </ul>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className='products'>
          {products.map((product) => (
            <li key={product.id}>
              <div className='product'>
                <Link to={'/product/' + product.id}>
                  <img
                    className='product-image'
                    src={product.imagePath}
                    alt='product'
                  />
                </Link>
                <div className='product-name'>
                  <Link className='product-link' to={'/product/' + product.id}>
                    {product.title}
                  </Link>
                </div>
                <div className='product-stock'>
                  Count in stock: {product.countInStock}
                </div>
                <div className='product-price'>₴{product.price}</div>
                <div className='product-rating'>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default HomeScreen;
