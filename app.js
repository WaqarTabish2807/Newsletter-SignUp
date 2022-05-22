const express = require("express");
const bodyParser = require("body-parser");
const { send } = require("express/lib/response");
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

    const firstName = req.body.fname;
    const secondName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://usX.api.mailchimp.com/3.0/lists/YourListId";

    const options = {
        method: "POST",
        auth: "waqs:YourApiKey"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200){
            
            res.sendFile(__dirname+("/success.html"));
        }else{
            res.sendFile(__dirname+("/failure.html"));
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end()
});

app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});





