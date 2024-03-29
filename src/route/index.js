const loginRouter = require('./Auth/login');
const signupRouter = require('./Auth/signup');
const forgetRouter = require('./Auth/forget');
const homeRouter = require('./Home/home');
const courseRouter = require('./Course/Course');
const announcementRouter = require('../route/Annoucement/Annoucement');
const studentRouter = require('../route/Student/Student');
const db = require('../../database/db');
const AccountSchema = require('../model/Account');
const Annoucement = require('../model/Annoucement');

//connect database
db.connect();


function route(app){

    
    //  /signup
    app.use("/signup", signupRouter);
    
    //  /login 
    app.use('/login', loginRouter); 
    
    //  /forget
    app.use('/forget', forgetRouter);

    //  /home
    app.use('/home', homeRouter);

    //  /logout
    app.post('/logout', async(req, res) => {
            
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.redirect('/login');
    });

    /// /announcement
    app.use('/announcement', announcementRouter);


    // /student
    app.use('/student', studentRouter);

    //  /course
    app.use('/course', courseRouter);

    // DEFAULT PAGE
    app.get('/', (req, res) =>{
        const accessToken =req.cookies.accessToken;
        const refreshToken =req.cookies.refreshToken;
        if(accessToken||refreshToken){
            res.redirect('/home');  
        }
        else{
            //only show public information 
        let AnnoucementQuery = Annoucement.find({Public: true})
        AnnoucementQuery.sort({
            DateUpdateAt: 'desc'
        })
        .then(AnnoucementInfoS =>{
            AnnoucementInfoS = AnnoucementInfoS.map(AnnoucementInfo=>AnnoucementInfo.toObject()) 
            res.render("defaultpage", {AnnoucementInfoS});
        })
        }
    })
    
    app.use((req, res, next) => {
        res.status(404).send(
            "<h1>Page not found on the server</h1>")
    })
}

module.exports = route;