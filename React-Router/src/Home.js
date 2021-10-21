import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h2>Home Page!</h2>
            <Link to='page2'><p>Go to Page 2</p></Link>
            <Link to='page3/Mudassir'><p>Go to Page 3</p></Link>
        </div>
    )
}

export default Home
