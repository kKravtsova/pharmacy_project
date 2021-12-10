import React, { useState, useEffect } from 'react';

function DeliveryScreen(props) {
  return (
    <div className='profile'>
      <div className='profile-info'>
        <div className='form'>
          <ul className='form-container'>
            <li>
              <h2>Nova Poshta (Local pickup)</h2>
            </li>
            <li>
              <p>
                The delivery time of your parcel by the "New mail" company to
                the destination is usually no more than 3 working days. Orders
                placed before 14:00, we transfer on the same day to the company
                "New mail" for delivery. Orders placed after 14:00 - we transfer
                the company "New Mail" the next day. After that, the carrier
                will notify you of the exact time and date of arrival of the
                goods at the destination. With an order amount of up to 599 UAH,
                the delivery cost is only 39 UAH, with an order amount over 599
                UAH, delivery is free!
              </p>
            </li>
            <li>
              <h2>Justin</h2>
            </li>
            <li>
              <p>
                The delivery time of your parcel by Justin to the destination is
                usually 1 working day in Kiev, and 1-3 working days in Ukraine.
                The next day after placing your order, we hand over the package
                to Justin for delivery. After that, the carrier will notify you
                of the arrival of the goods at the destination. You can also
                track the status of the package on the Justin website. With an
                order amount of up to 499 UAH, the delivery cost is only 29 UAH,
                with an order amount over 499 UAH, delivery is free!
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeliveryScreen;
