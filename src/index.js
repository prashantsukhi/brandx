const   express = require('express'),
        path = require('path'),
        morgan = require('morgan'),
        mysql = require('mysql2'),
        myConnection = require('express-myconnection'),
        methodOverride = require('method-override'),
        bodyParser = require('body-parser');

const multer  = require('multer');

const app = express();


// importing routes
const customerRoutes = require('./routes/customer');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(methodOverride(function(req, res){
//     if (req.body && typeof req.body == 'object' && '_method' in req.body) { 
//             var method = req.body._method;
//             delete req.body._method;
//             return method;
//         } 
//     })
// );

app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'lockers'
}, 'single'));
app.use(express.urlencoded({extended: false}));

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/uploads/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage
});

// routes
app.use('/', upload.single('profile_img'), customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
