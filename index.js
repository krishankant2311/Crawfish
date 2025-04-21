const express =require("express");
const http = require("http");
const { Server } = require("socket.io");
const app=express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const dotenv = require("dotenv");
const database = require("./config/database");
const path = require("path")
const bodyParser = require("body-parser");
const cors = require('cors');
const startDeleteOldUsersJob = require('././././crone/croneJob')
const startDeleteOldRestaurantJob = require("././././crone/croneJob")
const faqRoute = require('./module/FAQ/routes/FAQroute')
const adminRoutes = require("./module/admin/routes/adminRoute");
const userRouter = require('./module/user/routes/userRoute')
const reviewRouter = require('./module/reviews/routes/reviewRoute')
const addressRouter = require('./module/address/routes/addressRoute')
const restaurantRouter = require('./module/restaurants/routes/restaurantRoute')
const termsAndConditionsRouter = require("./module/terms&conditions/routes/terms&conditionroute")
const filterRouter = require("./module/filter/routes/filterRoute")
const favouriteRoute = require("./module/favourite/routes/favouriteroute")
const searchRouter = require("./module/search/routes/searchRoute")
const preferenceRouter = require("./module/prefrences/routes/prefrenceRoute")
const chatRoutes = require("./module/socketIO/routes/socketRoute");
const socketHandler = require("./module/socketIO/socket");
const privacyPolicyRouter = require("./module/privacyPolicy/route/privacyPolicyRoute")
const scrapingRouter = require("./scrapping/scrappingGoogleMap")
const homepageRouter = require("./module/homepage/routes/homepageRoute")
const notificationRouter = require("./module/notification/routes/notificationRoute")
dotenv.config()

app.use(bodyParser.json());


database.connect();
startDeleteOldUsersJob();
startDeleteOldRestaurantJob();
app.use(cors());
app.use(require("cors")());

app.use(express.json());
app.use(bodyParser.json())
app.use("/public",express.static(path.join(__dirname,"public")))
const PORT =process.env.PORT || 8000;

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:`{"your server is running at ${PORT}}`
    })
})
// require("./module/socketIO/controller/socketController")(io);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
  socketHandler(io);

app.use("/api/admin",adminRoutes);
app.use("/api/user",userRouter);
app.use("/api/review",reviewRouter);
app.use("/api/address",addressRouter);
app.use("/api/filter",filterRouter)
app.use("/api/restaurant",restaurantRouter)
app.use("/api/termsAndConditions",termsAndConditionsRouter)
app.use("/api/favourite",favouriteRoute)
app.use("/api/search",searchRouter)
app.use("/api/faq",faqRoute)
app.use("/api/preference",preferenceRouter)
app.use("/api/chat", chatRoutes);
app.use("/api/privacyPolicy",privacyPolicyRouter)
app.use("/api/scrapping",scrapingRouter)
app.use("/api/homepage",homepageRouter)
app.use("/api/notification",notificationRouter)


server.listen(PORT, ()=>{
    console.log("Server is running on port",PORT);
}
)
