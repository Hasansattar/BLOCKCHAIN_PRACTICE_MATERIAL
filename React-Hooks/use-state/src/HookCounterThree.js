import React, { useState } from 'react'

function HookCounterThree() {
    const [name, setName] = useState({ firstName: " ", lastName: " " })

    return (
        <div>
            <form>
                <input type="text" value={name.firstName} onChange={e => setName({...name, firstName: e.target.value})}/>
                <input type="text" value={name.lastName} onChange={e => setName({...name, lastName: e.target.value})}/>
            </form>

        <h2>Your First Name is : {name.firstName}</h2>
        <h2>Your Last Name is : {name.lastName}</h2>

        {/*If we implement this we are having a problem that First Name
        & Last Name are not getting merge and state is only showing 1 value
        at a time.
        this is because useState does not merge and update the OBJECT automatically,
        we have to do it mannually with adding ...name in onChange so it will 
        copy every property present in object and the overwrite firstName or lastName 
        with that existing value*/}
        <h2>{JSON.stringify(name)}</h2> {/*this will show the current state value*/}
        </div>
    )
}

export default HookCounterThree
