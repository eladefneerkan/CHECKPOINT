// handles list related API calls
const URL_BASE = "http://localhost:3000/gameLists"

//helper method for each exported function
//providing base logic for API calling
const apiCall = async (endpoint, method = "GET", token, body = null) => {
    const headers = {
            Authorization: `Bearer ${token}`,
    }

    //body carries data for POST/PUT requests
    //null by default, since it's not used in every request
    if(body){
        headers["Content-Type"] = "application/json"
    }

    //opts used by fetch API to specify request details
    //except URL which is passed separately
    const opts = {
        method, headers, 
        body: body ? JSON.stringify(body) : null,
    }

    const response = await fetch(endpoint, opts)

    //handle not found response
    if (response.status === 404){
        return null
    }

    //handle other errors
    if(!response.ok){
        let errData = {}
        try{
            errData = await response.json()
        }
        catch(e){
            //failure reading error body such as 500 status with no json body
            console.error("Error parsing error response:", e)
        }
        //throw error object using server-provided message or a default one
        const err = new Error(errData.error || 'HTTP Error. Status: ' + response.status)
        err.status = response.status
        throw err
    }

    //handle DELETE/PUT opts with no content response
    if(response.status === 204){
        return {}
    }

    return response.json()
}


export const fetchUserLists = async (token) => {
    try {
        const data = await apiCall(URL_BASE, "GET", token)
        return data
    } catch (err) {
        console.error("Error fetching lists:", err)
        throw err
    }
}

export const addGameToList = async (listId, gameId, token) => {
    const response = await apiCall(`${URL_BASE}/${listId}/games`, "POST", token, { gameId })
    return response
}

export const createNewList = async (title, token) => {

    try{
        const response = await apiCall(URL_BASE, "POST", token, {
            title,
            description: "",
        })
        return response
    }
    catch(err){
        //catch the error thrwon by apiCall and
        //rethrow as a structured object for frontend component to handle
        throw {
            status: err.message.includes("401") ? 401 : 500,
            error: err.message || 'Failed to create new list'
        }
    }
}

