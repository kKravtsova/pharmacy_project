import React, { useState, useEffect } from 'react';

function PaymentInfoScreen(props) {
  return (
    <div className='profile'>
      <div className='profile-info'>
        <div className='form'>
          <ul className='form-container'>
            <li>
              <h2>Cash upon receipt of the goods</h2>
            </li>
            <li>
              <p>
                Cash payment at the time of order delivery. Buyer transfers
                money to the forwarder-cashier and receives the ordered goods
                and package documents (sales receipt or invoice (documents that
                confirm purchase), warranty card, manual operation).
              </p>
            </li>
            <li>
              <h2>Payment by card</h2>
            </li>
            <li>
              <p>
                You can pay for the order upon receipt by credit card Visa and
                MasterCard no commission.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfoScreen;
