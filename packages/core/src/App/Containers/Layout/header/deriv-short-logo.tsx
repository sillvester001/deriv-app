import React from 'react';
import DerivBrandShortLogo from 'Assets/SvgComponents/header/deriv-logo-short.svg';

const DerivShortLogo = () => {
    return (
        <div className='header__menu-left-logo'>
            <a href='/'>
                <DerivBrandShortLogo />
            </a>
        </div>
    );
};

export default DerivShortLogo;
