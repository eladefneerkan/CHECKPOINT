
export default class GameObj{

        constructor(id, name, slug, released, rating, description, background_image, genres)
        {
            this.id = id //we can get a game ID from the db, helps keep track of the games
            this.name = name
            this.slug = slug
            this.released = released
            this.rating = rating
            this.description = description
            this.background_image = background_image //make sure the url returned by the db is valid and have a method to parse that
            this.genres = genres //array of genres
            
            
            
            //To add later: genres (add as string array or as a genre obj array if genres have IDs etc.)
        }

       getImageDisplay(){
            return this.background_image || 'https://placehold.co/150x200?text=Image+Missing' //temporary placehold image if image not found, we can replace w something else
       }

}