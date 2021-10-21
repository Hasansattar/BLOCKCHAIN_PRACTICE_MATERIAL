import React, { useState } from 'react'

function HookCounterFour() {
    const [items, setItem] = useState([])

    const addItem = ()=> {
        setItem([
            ...items, {
            id: items.length,
            value: Math.floor(Math.random() * 10) + 1
            }
        ])
    }

    return (
        <div>
            <button onClick={addItem}>Add a number</button>
            <ul>
                {items.map(items => (
                    <li key={items.id}>{items.value}</li>
                ))}
            </ul>
        </div>
    )
}

export default HookCounterFour
