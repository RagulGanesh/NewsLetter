const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const request=require('request')
const https= require('https')
require('dotenv').config()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    console.log("Server works")
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;
    console.log(firstName)
    console.log(lastName)
    console.log(email)
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url="https://us18.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;
    const options={
        method:"POST",
        auth:"ragul:"+process.env.API_KEY,
    }

    const request = https.request(url,options,(response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on('data',(data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
      
})

app.get("/failure",(req,res)=>{
    res.redirect("/");
})


// app.listen(3000,()=>{
//     console.log("Server running @ port number 3000")
// })
app.listen(process.env.PORT||3000,()=>{
    console.log("Server running @ port number 3000")
})


