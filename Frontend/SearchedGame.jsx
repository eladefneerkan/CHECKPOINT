import React from 'react'
function clearLocal(){
    localStorage.clear();
}
export default function SearchGame() {
    
    const searchGame = localStorage.getItem("searchedGame");
    let searchGameArray = searchGame.split("☝");
    if (searchGame.length == 0){
        return (<p id = "gamelist"> Nothing showed up</p>)
    }
    return (
        <> {searchGameArray.map((item) => (
            <div>
                <p id = "gamelist"> {item}</p>
            </div>))}
            {localStorage.clear()}
        </>
        

            
    )
}

/**/