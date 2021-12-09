import React, { useState, useEffect } from 'react';

function DiscountScreen(props) {
  return (
    <div className='profile'>
      <div className='profile-info'>
        <div className='form'>
          <ul className='form-container'>
            <li>
              <h2>There are no promotions at the moment</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DiscountScreen;
