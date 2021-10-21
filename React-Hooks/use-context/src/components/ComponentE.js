import React, {useContext} from 'react'
import { userContext, channelContext } from '../App'

function ComponentE() {

    const user = useContext(userContext);
    const channel = useContext(channelContext);

    return (
        <div>
            {user} - {channel}
        </div>
    )
}

export default ComponentE

/*
We can see that how easy it is to use Context in our components with 
useContext() Hook as compared to ComponentF Implementaion.
*/