const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body["first-name"];
  const lastName = req.body["last-name"];
  const emailAddress = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us12.api.mailchimp.com/3.0/lists/0e76f5fe84";

  const options = {
    method: "POST",
    auth: "debanjan1:" + mailchimpApiKey,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData); //Sending our data to mailchimp's server
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen("3000", () => {
  console.log("Server running on Port 3000.");
});
