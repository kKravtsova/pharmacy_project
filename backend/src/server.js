import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';
import categoryRoute from './routes/categoryRoute';
import deliveryRoute from './routes/daliveryRoute';
import roleRoute from './routes/roleRoute';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/upload', uploadRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/deliveries', deliveryRoute);
app.use('/api/roles', roleRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/src/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  console.log(req.url);
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

app.listen(config.PORT, () => {
  console.log('Server started');
});
