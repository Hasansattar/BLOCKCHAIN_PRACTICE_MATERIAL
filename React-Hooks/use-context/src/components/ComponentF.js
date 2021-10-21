import React from 'react';
import {userContext, channelContext} from '../App'

function ComponentF() {
    return (
        <div>
            <userContext.Consumer>
                {
                    user => {
                    return(
                        <channelContext.Consumer>
                            {
                                channel => {
                                return (
                                    <div>
                                        User Context Value is {user}, Channel Context Value is {channel}
                                    </div>
                                    )
                                }}
                        </channelContext.Consumer>
                    )
                }}
            </userContext.Consumer>
        </div>
    )
}

export default ComponentF

/*
Before useContext Hook we need to Consume Context with this format which is
a bit confusing and difficult to understand this is when useContext() came
*/
