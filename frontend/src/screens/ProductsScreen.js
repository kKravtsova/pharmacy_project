import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  saveProduct,
  listProducts,
  deleteProdcut,
} from '../actions/productActions';

function ProductsScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(1);
  const [categoryList, setCategoryList] = useState([]);
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const productList = useSelector((state) => state.productList);
  const { loading, products, error } = productList;

  const productSave = useSelector((state) => state.productSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = productSave;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listProducts());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const openModal = (product) => {
    setModalVisible(true);
    setId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.imagePath);
    setCategory(product.categoryId);
    setCountInStock(product.countInStock);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        id,
        title,
        price,
        image: image || '/src/uploads\\default.png',
        category,
        countInStock,
        description,
      })
    );
  };
  const deleteHandler = (product) => {
    dispatch(deleteProdcut(product.id));
  };
  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);
    axios
      .post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setImage(response.data);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };
  const getCategoriesHandler = () => {
    axios
      .get('/api/categories')
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className='content content-margined'>
      <div className='product-header'>
        <h3>Products</h3>
        <button
          className='button primary'
          onClick={() => {
            getCategoriesHandler();
            openModal({});
          }}
        >
          Create Product
        </button>
      </div>
      {modalVisible && (
        <div className='form'>
          <form onSubmit={submitHandler}>
            <ul className='form-container'>
              <li>
                <h2>Create Product</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor='title'>Title</label>
                <input
                  type='text'
                  name='title'
                  value={title}
                  id='title'
                  onChange={(e) => setTitle(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor='price'>Price</label>
                <input
                  type='text'
                  name='price'
                  value={price}
                  id='price'
                  onChange={(e) => setPrice(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor='image'>Image</label>
                <input
                  type='text'
                  name='image'
                  value={image}
                  id='image'
                  onChange={(e) => setImage(e.target.value)}
                ></input>
                <input type='file' onChange={uploadFileHandler}></input>
                {uploading && <div>Uploading...</div>}
              </li>
              <li>
                <label htmlFor='countInStock'>Count in stock</label>
                <input
                  type='text'
                  name='countInStock'
                  value={countInStock}
                  id='countInStock'
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor='category'>Category</label>
                <select
                  name='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryList.map((x) => (
                    <option value={x.id}>{x.name}</option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor='description'>Description</label>
                <textarea
                  name='description'
                  value={description}
                  id='description'
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </li>
              <li>
                <button type='submit' className='button primary'>
                  {id ? 'Update' : 'Create'}
                </button>
              </li>
              <li>
                <button
                  type='button'
                  onClick={() => setModalVisible(false)}
                  className='button secondary'
                >
                  Back
                </button>
              </li>
            </ul>
          </form>
        </div>
      )}

      <div className='product-list'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>In stock</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.countInStock}</td>
                <td>{product.price}</td>
                <td>{product.category?.name}</td>
                <td>
                  <button
                    className='button'
                    onClick={() => {
                      getCategoriesHandler();
                      openModal(product);
                    }}
                  >
                    Edit
                  </button>{' '}
                  <button
                    className='button'
                    onClick={() => deleteHandler(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductsScreen;
