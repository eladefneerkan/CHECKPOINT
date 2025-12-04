// handles list related API calls

export const fetchUserLists = async (token) => {
    try {
        const response = await fetch("http://localhost:3000/gameLists", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
        const data = await response.json()
        return data
    } catch (err) {
        console.error("Error fetching lists:", err)
        throw err
    }
}

export const addGameToList = async (listId, gameId, token) => {
    const response = await fetch(`http://localhost:3000/gameLists/${listId}/games`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId }),
    })
    return response
}

export const createNewList = async (title, token) => {

    const response = await fetch("http://localhost:3000/gameLists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: "",
        }),
      })

      if (!response.ok) {
        const result = await response.json();
        throw { // changed to throw structured error to be caught by component
            status: response.status,
            error: result.error || 'Failed to create new list'
        }
      }

    const result = await response.json()
    return result.list;
}

