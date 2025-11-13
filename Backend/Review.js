
class ReviewClass{

        constructor(ID, comment, rating, gameID)
        {
            this.ID = ID
            this.comment = comment
            this.rating = rating
            this.gameID = gameID
            // later once database is set up we will get the game object itself from gameID
            // for now we will just have this placeholder code
            this.gameIMG = 'https://sirstack.db-destiny.net/morphylogeny/408/OtBOtR001.JPG'
        }

       displayGameImage(){
            return this.gameIMG || 'https://placehold.co/150x200?text=Image+Missing' //temporary placehold image if image not found, we can replace w something else
       }
}

export default ReviewClass