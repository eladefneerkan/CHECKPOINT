
class UserObj{

        constructor(ID, name, profilePicture, bio)
        {
            this.ID = ID //we can get a game ID from the db, helps keep track of the games
            this.name = name
            this.profilePicture = profilePicture //make sure the url returned by the db is valid and have a method to parse that
            this.bio = bio
            //later once database is set up:
            // add lists connection?
            // review list

            //review obj: 
            // rating
            // review
            // game
        }

       displayProfilePic(){
            return this.profilePicture || 'https://placehold.co/150x200?text=Image+Missing' //temporary placehold image if image not found, we can replace w something else
       }
       
       

}