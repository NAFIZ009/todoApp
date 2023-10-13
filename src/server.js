const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');


const server=http.createServer((req, res)=>{
    const pathObj =url.parse(req.url,true);
    // Url {
    //     protocol: null,
    //     slashes: null,
    //     auth: null,
    //     host: null,
    //     port: null,
    //     hostname: null,
    //     hash: null,
    //     search: '?hello=7',
    //     query: [Object: null prototype] { hello: '7' },
    //     pathname: '/date',
    //     path: '/date?hello=7',
    //     href: '/date?hello=7'
    //   }
    
    if(pathObj.pathname=='/todoList')
    {
        if(req.method=='POST')
        {
            let data={};
            let reciveData='';
            req.on('data',chunk=>{
                reciveData+=chunk;
            });
            req.on('end',()=>{
                data=JSON.parse(reciveData);
                const filePath=path.join(__dirname,'..','todo_file',`${data.date}`);
                fs.writeFile(filePath, JSON.stringify(data),(err)=>{
                    if(err)
                    {
                        res.writeHead(500,{'content-type':'application/json'});
                        res.end(JSON.stringify({status:'unsuccessful', message:'server error'}));
                    }
                    res.writeHead(201,{'content-type':'application/json'});
                    res.end(JSON.stringify({status:'successful', message:'upload done'}));
                });
            });
            
        }else if(req.method=='GET')
        {
            const parameter=pathObj.query;
            if(parameter.date)
            {
                fs.readFile(path.join(__dirname,'..','todo_file',`${parameter.date}`),'utf8',(err,data)=>{
                    if(err)
                    {
                        res.writeHead(500,{'content-type':'application/json'});
                        res.end(JSON.stringify({status:'unsuccessful', message:'server error'}));
                    }
                    res.writeHead(200,{'content-type':'application/json'});
                    res.end(JSON.stringify({status:'successful', data:JSON.parse(data)}));
                });
            }
        }
        
    }
});

server.listen(5001,()=>{
    console.log('listening on port',5001);
});



// {
//     "date":"13-10-2023",
//     "list":[
//         "weak up",
//         "code",
//         "sleep"
//     ]
// }