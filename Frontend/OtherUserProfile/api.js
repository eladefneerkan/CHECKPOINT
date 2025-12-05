//out the getter functions here instead 

export async function getUserById(id) {
    const res = await fetch(`http://localhost:3000/users/${id}`);
    if (!res.ok) throw new Error("User fetch failed");
    return res.json();
  }
  
  export async function getPublicListsByUser(id) {
    const res = await fetch(`http://localhost:3000/gameLists/public/user/${id}`);
    if (!res.ok) throw new Error("List fetch failed");
    return res.json();
  }
  