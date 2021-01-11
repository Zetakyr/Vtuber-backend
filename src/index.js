const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");

app.use(cors());
app.use(express.json());

//ROUTES//

// Creates a user

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = await pool.query("INSERT INTO users (email, password, likes) VALUES($1, $2, $3) RETURNING *",
            [email, password, {}])
        res.send(newUser)
    } catch (err) {
        res.send({
            error: err.message
        })


    }
})

// Gets a user

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // LIMIT 1 is so that the database stops searching as soon as it finds a match
        const result = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email])
        const user = result?.rows[0];

        if (password === user.password) {
            res.send(user)
        }
        throw ({ message: "Authentication failed" });
    } catch (err) {
        res.send({
            error: err?.message
        })


    }
})

// Vtubers

// Creates a vtuber

app.post("/createVtuber", async (req, res) => {
    try {
        const { name } = req.body;
        const newVtuber = await pool.query("INSERT INTO vtuber (name, \"platformLink\", \"socialsLink\", genre, model, groups, \"characterArt\", \"cardArt\", likes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [name, { youtube: null, twitch: null }, { facebook: null, twitter: null, instagram: null }, [], { png: false, model2d: false, model3d: false }, [], null, null, {}])
        res.send(newVtuber)
    } catch (err) {
        res.send({
            error: err?.message
        })


    }
})

//get all vtubers

app.get("/getVtuber", async (req, res) => {
    try {
        const allVtubers = await pool.query("SELECT * FROM vtuber");
        res.json(allVtubers.rows);

    } catch (err) {
        console.error(err.message)
    }
})

//get a vtuber

app.get("/getVtuber/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const aVtuber = await pool.query("SELECT * FROM vtuber WHERE name = $1 LIMIT 1", [name]);

        res.json(aVtuber.rows[0]);

    } catch (err) {
        console.error(err.message)
    }
})

//update a vtuber's links and their character art.

app.put("/updateVtuber/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const { youtube, twitch, charArt, cardArt, } = req.body;
        const platforms = {
            youtube, twitch
        }
        const updateVtuber = await pool.query(`UPDATE vtuber SET "platformLink" = "platformLink" || $1, "characterArt" = $2, "cardArt" = $3 where name = $4`, [platforms, charArt, cardArt, name]);

        res.json(`${name} was updated`);
    } catch (err) {
        console.error(err.message)
    }
})

//add a genre to the vtuber.

app.put("/addgenre/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const { newGenre } = req.body;
        const updateVtuber = await pool.query("UPDATE vtuber SET genre = genre || $1 WHERE name = $2",
            [`{${newGenre}}`, name]);
        res.send("genre was added.");
    } catch (err) {
        console.error(err.message)
    }
})

// links the vtubers to the user if a user likes a vtuber.

app.put("/like/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const { email } = req.body;
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        const vtuberResult = await pool.query("SELECT * FROM vtuber WHERE name = $1", [name])

        const user = userResult?.rows[0];
        const vtuber = vtuberResult?.rows[0];

        const userLikes = user.likes;
        const vtuberLikes = vtuber.likes;

        if (userLikes[name]) {
            delete userLikes[name];
            delete vtuberLikes[email];
        } else {
            userLikes[name] = true;
            vtuberLikes[email] = true;
        }



        const updateVtuber = await pool.query("UPDATE vtuber SET likes = $1 RETURNING *", [vtuberLikes])
        const updateUser = await pool.query("UPDATE users SET likes = $1 RETURNING *", [userLikes])
        res.send({
            user: updateUser?.rows[0],
            vtuber: updateVtuber?.rows[0]
        })
    } catch (err) {
        console.error(err);
    }
})

const server = app.listen(8080, () => {
    const { address, port } = server.address();
    console.log('Listening at server ', address, ' and port ', port)
})