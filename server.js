var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function (username, password, cb) {
    const user = { id: 1, username, password }
    if (user.username == "admin" && user.password == "admin") {
      return cb(null, user);
    }
    else {
      return cb(null, false, { message: "Incorect account" });
    }
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  const user = { id: 1, username: "admin", password: "admin" };
  cb(null, user);
});

const db = require('./sequelize').default;

// Create a new Express application.
var app = express();


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
const logger = require('morgan');
//const cors = require('cors');
const bodyParser = require('body-parser');
const connect = require('connect-ensure-login');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.

app.post('/login', passport.authenticate('local'), async (req, res) => {
  res.status(200).send({ message: "Logare reusita" });
});

app.get('/logout', connect.ensureLoggedIn('/login'), (req, res) => {
  req.logout();
  res.status(200).send({ message: "You've been logged out" });
});

app.post('/comenzi/adaugare', (req, res) => {
  const Comenzi = require('./models').Comenzi;

  const name = req.body.name;
  const location = req.body.location;
  const noProducts = req.body.noProducts;
  const totalSum = req.body.totalSum;
  const date = req.body.date;

  const comanda = {
    name,
    location,
    noProducts,
    totalSum,
    date
  }
  Comenzi.create(comanda).then(() => {
    res.status(200).send({ message: "Comanda inregistrata" });
  }).catch(() => {
    res.status(500).send({ message: "cOmanda" });
  })

});

app.post('/comenzi/afisare', (req, res) => {
  const Comenzi = require('./models').Comenzi;
  const dateInit = req.body.dateInit;
  const dateFin = req.body.dateFin;
  const sequelize = require('sequelize');
  const op = sequelize.Op;

  Comenzi.findAll({
    where: {
      date: {
        [op.between]: [dateInit, dateFin]
      }
    },
    order: [['date', 'DESC']]
  }).then(comenzi => {
    res.status(200).send(comenzi);
  }).catch(() => {
    res.status(500).send({ message: "Eroare la db" });
  })
});

app.post('/recenzii/adaugare', (req, res) => {
  const Recenzii = require('./models').Recenzii;
  const recenzie = { recenzie: req.body.recenzie };

  Recenzii.create(recenzie).then(() => {
    res.status(200).send({ message: "Recenzie inregistrata" });
  }).catch(() => {
    res.status(500).send({ message: "Recenzia nu a fost incarcata" })
  })
});

app.get('/recenzii/afisare', (req, res) => {
  const Recenzii = require('./models').Recenzii;
  Recenzii.findAll().then((recenzii) => {
    res.status(200).send(recenzii);
  }).catch(() => {
    res.status(500).send({ message: "Eroare la db" })
  })
});

const multer = require('multer');
let storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });

app.post('/produse/adaugare', upload.single('image'), (req, res) => {
  const Produse = require('./models').Produse;

  const denumire = req.body.denumire;
  const specificatiiMinime = req.body.specificatiiMinime;
  const pret = req.body.pret;
  const descriere = req.body.descriere;
  const poza = req.file.path;
  const produs = {
    denumire,
    specificatiiMinime,
    pret,
    descriere,
    poza
  }
  Produse.create(produs).then(() => {
    res.status(200).send({ message: "Reusit" });
  }).catch(() => {
    res.status(500).send({ message: "Fail" });
  })

});

app.post('/produse/activare', (req, res) => {
  const Produse = require('./models').Produse;

  const denumire = req.body.denumire;
  Produse.findOne({ where: { denumire } }).then(produs => {
    produs.eActivat = true;
    produs.save({ fields: ['eActivat'] });
    res.status(200).send({ message: "Bravo" });
  }).catch(() => {
    res.status(500).send({ message: ":(" })
  })
});

app.post('/produse/dezactivare', (req, res) => {
  const Produse = require('./models').Produse;

  const denumire = req.body.denumire;
  Produse.findOne({ where: { denumire } }).then(produs => {
    produs.eActivat = false;
    produs.save({ fields: ['eActivat'] });
    res.status(200).send({ message: "Bravo" });
  }).catch(() => {
    res.status(500).send({ message: ":(" })
  })
});

app.get('/produse/afisare', (req, res) => {
  const Produse = require('./models').Produse;

  Produse.findAll({
    where: { eActivat: true }
  }).then(produs => {
    res.status(200).send(produs);
  }).catch(() => {
    res.status(500).send({ message: "Eroare la db" });
  })
});

app.get('/reset', (req, res) => {
  const connection = require('./models').connection;

  connection.sync({ force: true }).then(
    () => {
      res.status(200).send({ message: "Database reset" })
    }).catch(
      () => {
        res.status(500).send({ message: "Database reset error" }
        )
      })
});

app.use(express.static(__dirname + '/views'));


app.listen(3000, "127.0.0.1", function () {
  console.log("Server is listening on localhost");
});
