var express = require("express");
var mongoose = require("mongoose");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

app.use("/static", express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/urlshorthand")
  .then(() => {
    console.log("Connection Esstablished");
  })
  .catch((e) => {
    console.log(e);
  });

const ShortUrl = require("./models/ShortUrl");

// view engine setup
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const urlsData = await ShortUrl.find();
  res.render("home", {
    urls: urlsData,
  });
});

app.post("/short", async (req, res) => {
  try {
    const getUrl = new ShortUrl({
      full: req.body.fullUrl,
    });
    await getUrl.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/:shortUrl", async (req, res) => {
  console.log(req.params.shortUrl);
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null || shortUrl == undefined)
    return res.status(404).send("Bad request");

  res.redirect(shortUrl.full);
});

app.get("/delete/:id", async (req, res) => {
  var id = req.params.id;
  await ShortUrl.findByIdAndDelete({ _id: id });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
