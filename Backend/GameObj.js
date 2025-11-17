
class GameObj{

        constructor(ID, name, image, Background_image, rating, genres, description, released, slug)
        {
            this.ID = ID //we can get a game ID from the db, helps keep track of the games
            this.name = name
            this.image = image //make sure the url returned by the db is valid and have a method to parse that
            this.Background_image = Background_image
            this.rating = rating
            this.genres = genres //array of genres
            this.description = description
            this.released = released
            this.slug = slug
            
            //To add later: genres (add as string array or as a genre obj array if genres have IDs etc.)
        }

       getImageDisplay(){
            return this.image || 'https://placehold.co/150x200?text=Image+Missing' //temporary placehold image if image not found, we can replace w something else
       }

}