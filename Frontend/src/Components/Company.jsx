import React from 'react';
import '../Components/Company.css'
import { Link } from 'react-router-dom';

const Company = () => {
    return (
        <div className='company'>
            <Link to='#'>
                <div className="questions">
                    <h4>Wipro</h4>
                    <h4>Acenture</h4>
                    <h4>Tcs</h4>
                    <h4>ClodKaptan</h4>
                    <h4>TravClan</h4>
                    <h4>Concentrix</h4>
                    <h4>Capegimi</h4>
                    <h4>Falana</h4>
                    <h4>Dimkana</h4>
                </div>
            </Link>
        </div>
    )
}

export default Company