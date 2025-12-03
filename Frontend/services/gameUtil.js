// contains utility functions for game operations on the frontend

// Date formatting
export const parseDate = (dateStr) => {

    if(!dateStr) return 'Unknown'

    const yr = dateStr.substring(0,4)
    const m = dateStr.substring(5,7)
    const d = dateStr.substring(8,10)
    let m_str = ''
    switch(m){
        case '01': m_str = 'Jan'; break;
        case '02': m_str = 'Feb'; break;
        case '03': m_str = 'Mar'; break;   
        case '04': m_str = 'Apr'; break;
        case '05': m_str = 'May'; break;
        case '06': m_str = 'Jun'; break;
        case '07': m_str = 'Jul'; break;
        case '08': m_str = 'Aug'; break;
        case '09': m_str = 'Sep'; break;
        case '10': m_str = 'Oct'; break;
        case '11': m_str = 'Nov'; break;
        case '12': m_str = 'Dec'; break;
        default: m_str = '';    
    }
    return m_str + ' ' + d + ', ' + yr
}

// Genre formatting
// some games don't have genres, so use if/else to see if the games.genre exists
export const formatGenres = (genres) => {
    let genreList = "N/A";
    if(genres && Array.isArray(genres))
    {
        genreList = genres.map(genre => genre.name).join(', ')
    }
    return genreList;
}
