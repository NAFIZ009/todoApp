const http = require('http');
const url = require('url');

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
                console.log(data);
            });
            
        }
    }
});

server.listen(5001,()=>{
    console.log('listening on port',5001);
});



