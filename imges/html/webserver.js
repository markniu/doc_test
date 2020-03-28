var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
//var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
//var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
//var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
let path = "/media/usb/pandapi/";

http.listen(8181); //listen to port 8080

function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}
function read_u_path()
{
	var exec = require('child_process').exec;
	var cmdStr = 'df | grep \"/dev/sd\" > /home/pi/U_path';
	exec(cmdStr, function (err, stdout, srderr) {
	if(err) {
	console.log(srderr);
	} else {
	console.log(stdout);
	}
	});
	sleep(1000);//调用暂停函数
	  // Read the file and print its contents.
	var fs = require('fs');
    var filenam = "/home/pi/U_path";
	fs.readFile(filenam, 'utf8', function(err, data) {
	  if (err) throw err;
	  console.log('OK: ' + filenam);
	  console.log(data)
	  if(data.length>5)	
	  {
		  var pos = data.lastIndexOf(" /");
		  path=data.substr(pos+1)+"/pandapi/";
		  path=path.replace(/[\r\n]/g,"");  
		  console.log("path:"+path)
	  }
	  else
	  	path="";
	});


}
function handler (request, response) { //create server
 /* fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    console.log('dds');
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });*/
  	if (request.method === "GET") {
        let fname;
        // Look at what resource was requested and match that up
        // with the appropriate file name
        // DO not accept any resource requested because that could open up
        // your server for people to request your actual server code files
        console.log(request.url);
        switch(request.url) {
            case "/":
                fname = "/home/pi/phtml/html/index.html";
			    read_u_path();
                break;
            case "/css/socket.io.js":
                fname = "/home/pi/phtml/html/css/socket.io.js";
                break;
            case "/css/jquery-ui.min.css":
                fname = "/home/pi/phtml/html/css/jquery-ui.min.css";
                break;
            case "/css/jquery-ui.css":
                fname = "/home/pi/phtml/html/css/jquery-ui.css";
                break;
            case "/css/jquery.min.js":
                fname = "/home/pi/phtml/html/css/jquery.min.js";
                break;
            case "/css/jquery-ui.min.js":
                fname = "/home/pi/phtml/html/css/jquery-ui.min.js";
                break;
            case "/css/style.css":
                fname = "/home/pi/phtml/html/css/style.css";
                break;
            default:
                break;
        }
        if (fname) {
            fs.readFile(fname, function(err, data) {
                if (err) {
                    response.writeHead(404);
                    response.end();
                } else {
                    response.writeHead(200, {'Content-Type': 'text'})
                    response.write(data)
                    response.end();
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    }
}


io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  console.log('connect');
  //////////////
 
///////////
//	fs.readFile(__dirname + '/source/printerPI/Configuration.h',{encoding:'utf-8'}, function(err, data) { //read file index.html in public folder
	fs.readFile(path+'Configuration.h',{encoding:'utf-8'}, function(err, data) { //read file index.html in public folder
    if (err) {
    	console.log('error');
		socket.emit('src_err',"err:open"+path+'Configuration.h');
		return;
    }
	 
    socket.emit('src_view',data); 
    return  ;
  });

///////////

 
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    console.log('light'+data);    
//if (lightvalue != LED.readSync()) { //only change LED if status has changed
  //    LED.writeSync(lightvalue); //turn LED on or off
    //}
  });
  socket.on('src_select', function(data) { //get light switch status from client   
    console.log('src_select'+data);    
	fs.readFile(path+data,{encoding:'utf-8'}, function(err, data) { //read file index.html in public folder
    if (err) {
    	console.log('error');
		socket.emit('src_err','src_select err:'+data);
		return  ;
    }
	 
    socket.emit('src_view',data); 
    return  ;
  });
 });

console.log("open"+path);
//2. 指定需要读取的路径
//3. 读取路径，返回文件列表
fs.readdir(path, (err, files) => {
  if(err) 
  {
  	
  	//throw err;
  	console.log("can not open"+path);
	if(path.length<5)	
	   socket.emit('src_err',"Please Plug a U drive to Pi! see <a href='https://github.com/markniu/PandaPi/wiki/How-to-Edit-Marlin-code'>wiki</a> ");
	return;
  }
 // console.log(files);
      var count = files.length;
    //console.log(files);
    var results = {};
    files.forEach(function(filename){
        
        //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
      //  fs.stat(path.join(path,filename),function(err, stats){
       //     if (err) throw err;
            //文件
           // if(stats.isFile())
			//	{
				var arr = filename.split('.');
    			var len = arr.length;
				if(arr[len-1]=='cpp'||arr[len-1]=='h')
				{
					//console.log(filename);
					socket.emit('src_list',filename); 
				}
				
           // }else if(stats.isDirectory()){

           // }
      //  });
		});
});

  socket.on('src_write', function(data) { //get light switch status from client
    // 
	var arr = data.split('|luojin|');
	console.log('src_write'+arr[0]); 
	fs.writeFile(path+arr[0],arr[1],function(err){
    if(err){
        console.log(err);
		socket.emit('src_err',"err:write"+path+arr[0]);
    }else{
        console.log("file writes sucess!!")
		socket.emit('src_log',"\'"+arr[0]+"\' Saved ");
    }
	})

  });
  
function compile_make()
{
	const { spawn } = require('child_process');
	const ls = spawn('/home/pi/cmake', ['-C', path],{
  stdio: ['pipe', 'pipe', 'pipe']
});


	ls.stdout.on('data', (data) => {
	   console.log(`stdout: ${data}`);
	  socket.emit('src_compile_log',`${data}`); 
	});
	ls.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	  socket.emit('src_compile_log',`stderr:${data}`); 
	});

	ls.on('close', (code) => {
	  socket.emit('src_compile_log',`stdclose:${code}`); 
	});

	
}
  

  socket.on('src_compile', function(data) { //get light switch status from client
    // 
	if(data=='all')
	{
		const { spawn } = require('child_process');
		const lss = spawn('make', ['clean','-C', path]);
		var t=setTimeout(compile_make,3000);
	}
	else
	{
		compile_make();
	}
  });
/////////////////////
    socket.on('src_update', function(data) { //get light switch status from client
    // 
	if(data=='web_tools')
	{
		console.log('src_update: ' + data);
		const { spawn } = require('child_process');
		const ls = spawn('svn', ['update', "/home/pi/phtml/html/"],{
		  stdio: ['pipe', 'pipe', 'pipe']
		});


			ls.stdout.on('data', (data) => {
			   console.log(`stdout: ${data}`);
			 // socket.emit('src_compile_log',`${data}`); 
			  
			   var tstr=`${data}`;
			   tstr=tstr.replace(/home/g," ");
			   tstr=tstr.replace(/pi/g," ");
			   socket.emit('src_compile_log',tstr); 

			});
			ls.stderr.on('data', (data) => {
			  console.log(`stderr: ${data}`);
			  socket.emit('src_compile_log',`stderr:${data}`); 
			});

			ls.on('close', (code) => {
			  socket.emit('src_compile_log',`stdclose:${code}`+" \n\n Complete! Please reboot the Raspberry Pi"); 
			});

	}
	else if(data=='marlin')
	{
		console.log('src_update: ' + data + "__"+path);
		if(path.length<5)
		{
		    socket.emit('src_compile_log', " Error: no U disk, please plug in U disk(fat32) to Pi\n "); 
			return;
		}
		const { spawn } = require('child_process');
		const ls = spawn('svn', ['update', "/home/pi/PandaPI/Marlin2.x/"],{
		  stdio: ['pipe', 'pipe', 'pipe']
		});


			ls.stdout.on('data', (data) => {
			   console.log(`stdout: ${data}`);
			   var tstr=`${data}`;
			   tstr=tstr.replace(/home/g," ");
			   tstr=tstr.replace(/pi/g," ");
			   socket.emit('src_compile_log',tstr); 
			});
			ls.stderr.on('data', (data) => {
			  console.log(`stderr: ${data}`);
			  socket.emit('src_compile_log',`stderr:${data}`); 
			});

			ls.on('close', (code) => {
			  //socket.emit('src_compile_log',`stdclose:${code}`); 
			  
			  ///////////////
			  	var exec = require('child_process').exec;
				var cmdStr = 'mv '+path+' '+path.substr(0,path.length-1)+'_old_'+Math.round(Math.random()*100);
				 
				socket.emit('src_compile_log', "\n Backuping  "+cmdStr +'\n\n .....'); 
				cmdStr+=';cp /home/pi/PandaPI/Marlin2.x/pandapi '+path+' -rf';
				exec(cmdStr, function (err, stdout, srderr) {
				if(err) {
					console.log(srderr);
					socket.emit('src_compile_log',srderr); 
				} else {
					console.log(stdout);
					socket.emit('src_compile_log',stdout+"\n\n Complete!"); 
				
				}
				});
			 //////////////////////////	
			});

	}
  });
/////////
  socket.on('src_run', function(data) { // 
    // 
	var exec = require('child_process').exec;
	var cmdStr = 'killall pi_marlin;cp '+path+'libpi.so /home/pi/;cp '+path+'/pi_marlin /home/pi/ ';
	exec(cmdStr, function (err, stdout, srderr) {
	if(err) {
		console.log(srderr);
		socket.emit('src_compile_log',srderr); 
	} else {
		console.log(stdout);
		var tstr=stdout;
	   tstr=tstr.replace(/home/g," ");
	   tstr=tstr.replace(/pi/g," ");
		socket.emit('src_compile_log',tstr+" \n\n Complete!"); 
	
	}
	});




  });


});




process.on('SIGINT', function () { //on ctrl+c
 // LED.writeSync(0); // Turn LED off
 // LED.unexport(); // Unexport LED GPIO to free resources
 // pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
}); 

