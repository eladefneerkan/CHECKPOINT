// handles list related API calls
const URL_BASE = "http://localhost:3000/gameLists"

//helper method for each exported function
//providing base logic for API calling
const apiCall = async (endpoint, method = "GET", token, body = null) => {
    const headers = {
            Authorization: `Bearer ${token}`,
    }

    //body carries data for POST/PUT requests
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

    if (response.status === 404){
        return null
    }

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

//fetch all lists for the logged-in user
export const fetchUserLists = async (token) => {
    try {
        const data = await apiCall(URL_BASE, "GET", token)
        return data
    } catch (err) {
        console.error("Error fetching lists:", err)
        throw err
    }
}

//add a game to a specific list
export const addGameToList = async (listId, gameId, token) => {
    const response = await apiCall(`${URL_BASE}/${listId}/games`, "POST", token, { gameId })
    return response
}

//create a new list
export const createNewList = async (listData, token) => {
    try {
        const response = await apiCall(URL_BASE, "POST", token, listData)
        return response
    } catch (err) {
        //catch the error thrown by apiCall and
        //rethrow as a structured object for frontend component to handle
        throw {
            status: err.status || 500,
            error: err.message || 'Failed to create new list'
        }
    }
}

//fetch a single list by ID with full details
export const fetchListDetail = async (listId, token) => {
    try {
        const data = await apiCall(`${URL_BASE}/${listId}`, "GET", token)
        return data
    } catch (err) {
        console.error("Error fetching list detail:", err)
        throw err
    }
}

//update list details (i.e. title, description, coverImage)
export const updateList = async (listId, updateData, token) => {
    try {
        const response = await apiCall(`${URL_BASE}/${listId}`, "PUT", token, updateData)
        return response
    } catch (err) {
        console.error("Error updating list:", err)
        throw err
    }
}

//update list privacy (isPublic)
export const updateListPrivacy = async (listId, isPublic, token) => {
    try {
        const response = await apiCall(`${URL_BASE}/${listId}/privacy`, "PUT", token, { isPublic })
        return response
    } catch (err) {
        console.error("Error updating list privacy:", err)
        throw err
    }
}

//remove a game from a list
export const removeGameFromList = async (listId, gameId, token) => {
    try {
        const response = await apiCall(`${URL_BASE}/${listId}/games/${gameId}`, "DELETE", token)
        return response
    } catch (err) {
        console.error("Error removing game from list:", err)
        throw err
    }
}

//delete a list completely
export const deleteList = async (listId, token) => {
    try {
        const response = await apiCall(`${URL_BASE}/${listId}`, "DELETE", token)
        return response
    } catch (err) {
        console.error("Error deleting list:", err)
        throw err
    }
}