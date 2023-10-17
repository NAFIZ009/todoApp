//required modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

//middleware 
//date format validation middleware
function validateDateFormat(req,res,next) {
    //req url object 
    const pathObj =url.parse(req.url,true);

    //if date is not specified
    if(!pathObj.query.date)
    {
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Date is not specified'}));
        return;
    }

    // Define a regular expression for "DD-MM-YYYY" format
    const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(1000|19[0-9][0-9]|20[0-9][0-9]|9999)$/;

    // Parse the date components
    const [day, month, year] = pathObj.query.date.split('-').map(Number);
  
    // Check if the string matches the format & Validate day, month, and year ranges
    if ((!dateFormatRegex.test(pathObj.query.date))||(day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999)) {
        //if date format is not acceptable
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Date Format is not acceptable'}));
        return;
    }

    next(req,res);
  }

//date validation middleware
const validateDate=(req,res,next)=>{

    //req url object 
    const pathObj =url.parse(req.url,true);

    // //if date is not specified
    // if(!pathObj.query.date)
    // {
    //     res.writeHead(400,{'content-type':'application/json'});
    //     res.end(JSON.stringify({status:'Unsuccessful', message:'Date is not specified'}));
    //     return;
    // }
    //validate day,month and year
    //a date will be valid if it is today or tomorrow
    const [inputDay, inputMonth, inputYear] = pathObj.query.date.split('-').map(Number);

    //current date
    const currentDate = new Date();

    //check the input date is valid or not
    if(!((inputDay ===currentDate.getDate() && inputMonth === currentDate.getMonth()+1 && inputYear === currentDate.getFullYear())||(inputDay ===currentDate.getDate()+1 && inputMonth === currentDate.getMonth()+1 && inputYear === currentDate.getFullYear()))){
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Invalid date'}));
        return;
    }

    next(req, res);
}

//main server
const server=http.createServer((req, res)=>{

    //object of req url variables
    const pathObj =url.parse(req.url,true);
    
    //API endpoint
    if(pathObj.pathname=='/todoList')
    {
        //POST method 
        if(req.method=='POST')
        {
            //middleware for validate date format
            validateDateFormat(req,res,(req,res)=>{
                //middleware for validate date
                validateDate(req,res,(req,res)=>{
                    //variable that stores the clients sent data
                    let data={};
    
                    //data that receives chunks
                    let reciveData='';
    
                    //function that receives chunks
                    req.on('data',chunk=>{
                        reciveData+=chunk;
                    });
    
                    //function for end of receive chunks
                    req.on('end',()=>{
                        //storing the data as object to the memory
                        data=JSON.parse(reciveData);
    
                        //path of where the todoList will be stored
                        const filePath=path.join(__dirname,'..','todo_file',`${data.date}`);
    
                        //creating a .txt file of the todoList
                        fs.writeFile(filePath, JSON.stringify(data),(err)=>{
    
                            //if any error comes
                            if(err)
                            {
                                res.writeHead(500,{'content-type':'application/json'});
                                res.end(JSON.stringify({status:'unsuccessful', message:'server error'}));
                            }
    
                            //sending confirmation to the client for storing the todoList
                            res.writeHead(201,{'content-type':'application/json'});
                            res.end(JSON.stringify({status:'successful', message:'upload done'}));
                        });
                    });
            
                });
            });
        }
        //GET method
        else if(req.method=='GET')
        {
            const queryDate=url.parse(req.url,true).query.date;

            validateDateFormat(req, res,(req,res)=>{
                //file path of required data
                const filePath=path.join(__dirname,'..','todo_file',`${queryDate}`);

                //getting the todoList of the specified date
                fs.readFile(filePath,'utf8',(err,data)=>{

                    //if any error comes
                    if(err)
                    {
                        res.writeHead(500,{'content-type':'application/json'});
                        res.end(JSON.stringify({status:'Unsuccessful', message:'Server error'}));
                        //closing the api connection
                        return;
                    }

                    //sending todoList
                    res.writeHead(200,{'content-type':'application/json'});
                    res.end(JSON.stringify({status:'Successful', data:JSON.parse(data)}));
                });
            });    
        }
    }else
    {
        //if api is not valid
        res.writeHead(404,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'unsuccessful', message:'Address not found'}))
    }
});

server.listen(5001,()=>{
    console.log('listening on port',5001);
});



/*
Data Format that server will accept
{
    "date":"DD-MM-YYYY",
    "list":[
        ".....",
        ".....",
        ".....",
        ......
    ]
}
*/

// I have an API, Where clients will request data. The API will first check the query parameter of the URL and from the parameter, it will take the date. Now the server will retrieve the data according to the given in a folder where all data is stored with the name of dates. The retrieval of the data in the folder will be done by 'fs' module.  