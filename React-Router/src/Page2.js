import React from 'react';
import { Link } from 'react-router-dom';

function Page2() {
    return (
        <div>
            <h2>Page 2</h2>
            <Link to='/' ><p>Go to Home Page</p></Link>
        </div>
    )
}

export default Page2
