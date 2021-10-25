import { ThemeContext } from 'providers/ThemeProvider';
import React, { useContext, useEffect, useRef } from 'react';
import './carbonad.css';
import { Ad } from './styles';

const CarbonAd = () => {
    const carbon_wrapper = useRef(null)
    useEffect(() => {
        const script = document.createElement("script");
        script.src = 'https://cdn.carbonads.com/carbon.js?serve=CE7IVK7J&placement=wwwrahulpnathcom';
        script.async = true;
        script.id = "_carbonads_js"
        carbon_wrapper.current.appendChild(script);
    }, [])

        const { theme } = useContext(ThemeContext)
        return (
            <Ad theme={theme} ref={carbon_wrapper} className='carbon-adds-wrapper'></Ad>
        );
}


export default CarbonAd;