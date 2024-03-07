import React from 'react';
import '../Components/Feed.css';
import { Link } from 'react-router-dom';

const Feed = () => {
    return (
        <div>
            <div className="feed">
                <Link to='company'>
                <div className="card">
                  <h4>2019</h4>
                </div>
                </Link>

                <Link to='#'>
                <div className="card">
                  <h4>2020</h4>
                </div>
                </Link>

                <Link to='#'>
                <div className="card">
                  <h4>2021</h4>
                </div>
                </Link>

                <Link to='#'>
                <div className="card">
                  <h4>2022</h4>
                </div>
                </Link>

                <Link to='#'>
                <div className="card">
                  <h4>2023</h4>
                </div>
                </Link>

                <Link to='#'>
                <div className="card">
                  <h4>2024</h4>
                </div>
                </Link>
            </div>
        </div>

    )
}

export default Feed