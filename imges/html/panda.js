
function ui_mode_choose(check)
 {
 	if(check==1)
 	{
		document.getElementById('easy_ui0').style.visibility='hidden';
		document.getElementById('easy_ui1').style.visibility='visible';
	}
	else
 	{
		document.getElementById('easy_ui1').style.visibility='hidden';
		document.getElementById('easy_ui0').style.visibility='visible';
		socket.emit("src_select", "Configuration.h");
	//	update_Emode(cppEditor.getDoc().getValue());
	}
	

 }



function get_define_string(line_str,st_str,end_str)
{
	var start=line_str.indexOf(st_str);
	var stop=line_str.indexOf(end_str);
	var len=line_str.substring(start,stop).replace(/\s+/g,"").length;//replace ' '
	var star_len=line_str.substring(0,start).replace(/\s+/g,"").length;//replace ' '
	 
	if(len==st_str.length&&star_len==0)
	{
	 var un_start=line_str.substring(stop+end_str.length).indexOf("/");
	 var value_str;
	 if(un_start<=0)
	 	value_str=line_str.substring(stop+end_str.length).replace(/\s+/g,"");
	 else
	 	value_str=line_str.substring(stop+end_str.length,stop+end_str.length+un_start).replace(/\s+/g,"");
	   //alert(line_str.substring(stop+end_str.length)+"::"+value_str);
	 return value_str;
	}

	return "";

}

function get_define_enable(line_str,st_str,end_str)
{
	var start=line_str.indexOf(st_str);
	var stop=line_str.indexOf(end_str);
	var len=line_str.substring(start,stop).replace(/\s+/g,"").length;//replace ' '
	var star_len=line_str.substring(0,start).replace(/\s+/g,"").indexOf("//");//replace ' '
	 
	if(len==st_str.length)
	{
		 
		if(star_len>=0)
		{
			 
			return "Disable";
		}
		else 
			return "Enable";
	 
	  
	}
	return "";

}

function replace_define(start_str,stop_str,replace_str)
{
	var line_num=0;
	cppEditor.getDoc().eachLine( function(line){
		
		//var substr2 = line.text.match(/#define(\S*)/g);
		var value_s;
		//document.write(line.text.split(" ") + "<br />");
		if(stop_str=="BLTOUCH")
			value_s=get_define_enable(line.text,start_str,stop_str);
		else if(stop_str=="SENSORLESS_HOMING")
			value_s=get_define_enable(line.text,start_str,stop_str);
		else
			value_s=get_define_string(line.text,start_str,stop_str);
		if(value_s.length>0)
		{
		  // alert(replace_str+"::"+line_num);
        	cppEditor.getDoc().replaceRange(replace_str,{line: line_num, ch: 0},{line: line_num});		 
		    cppEditor.getDoc().setCursor({line: line_num, ch: 0});
			cppEditor.markText({line: line_num, ch: 0}, {line: line_num}, {className: "styled-background"});
		}
		line_num++;
		});

}

function change_input(id,des_str)
{
	var des_value= document.getElementById(id).value;
	var uncomment='';
	if(des_value=='MAX')
		des_value=1;
	else if(des_value=='MIN')
		des_value=-1;
	else if(des_value=='Enable')
	{
		des_value="";
		uncomment='';
	}
	else if(des_value=='Disable')
	{
		des_value="";
		uncomment='//';
	}
 ///////////////////////
    if(des_str=='DEFAULT_AXIS_STEPS_PER_UNIT')
    {
    	//des_value=" { 80, 80, 400, 93 } ";
    	des_value=" {  "+document.getElementById("x_step").value	+
    				", "+document.getElementById("y_step").value +
    				", "+document.getElementById("z_step").value +
    				", "+document.getElementById("e_step").value +" }";
    				

	}
    

	
	//alert(uncomment+"#define "+des_str+" "+des_value);
	replace_define("#define",des_str,uncomment+"#define "+des_str+" "+des_value);
	////////////////
	if(document.getElementById("SENSORLESS_HOMING").value=="Enable")
	{
		document.getElementById('x_sen').removeAttribute("disabled");
		document.getElementById('y_sen').removeAttribute("disabled");
	}
	else
	{
		document.getElementById('x_sen').setAttribute("disabled","disabled");
		document.getElementById('y_sen').setAttribute("disabled","disabled");
	}
	////////////////
			
}

function update_Emode(src_txt)
{
	//document.getElementById("src_view").value
	//var tx=cppEditor.getDoc().getValue("\n");
	//var lines=cppEditor.getDoc().getLineNumber();
	//replace_define("#define","X_BED_SIZE","#define X_BED_SIZE 600");
	
	cppEditor.getDoc().eachLine( function(line){
		 
		//var substr2 = line.text.match(/#define(\S*)/g);
		// alert(line_num);
		//document.write(line.text.split(" ") + "<br />");
		/////////print size
		var value_s=get_define_string(line.text,"#define","X_BED_SIZE");
		if(value_s.length>0)
			document.getElementById("x_size").value=value_s;
		value_s=get_define_string(line.text,"#define","Y_BED_SIZE");
		if(value_s.length>0)
			document.getElementById("y_size").value=value_s;
		value_s=get_define_string(line.text,"#define","Z_MAX_POS");
		if(value_s.length>0)
			document.getElementById("z_size").value=value_s;
		/////////////driver type
		value_s=get_define_string(line.text,"#define","X_DRIVER_TYPE");
		if(value_s.length>0)
			document.getElementById("Xmotor").value=value_s;
		value_s=get_define_string(line.text,"#define","Y_DRIVER_TYPE");
		if(value_s.length>0)
			document.getElementById("Ymotor").value=value_s;
		value_s=get_define_string(line.text,"#define","Z_DRIVER_TYPE");
		if(value_s.length>0)
			document.getElementById("Zmotor").value=value_s;
		value_s=get_define_string(line.text,"#define","E0_DRIVER_TYPE");
		if(value_s.length>0)
			document.getElementById("E0motor").value=value_s;
		/////////////Motor direction
		value_s=get_define_string(line.text,"#define","INVERT_X_DIR");
		if(value_s.length>0)
			document.getElementById("dir_x").value=value_s;
		value_s=get_define_string(line.text,"#define","INVERT_Y_DIR");
		if(value_s.length>0)
			document.getElementById("dir_y").value=value_s;
		value_s=get_define_string(line.text,"#define","INVERT_Z_DIR");
		if(value_s.length>0)
			document.getElementById("dir_z").value=value_s;
		value_s=get_define_string(line.text,"#define","INVERT_E0_DIR");
		if(value_s.length>0)
			document.getElementById("dir_e0").value=value_s;
		////////////end stop direction
		value_s=get_define_string(line.text,"#define","X_HOME_DIR");
		if(value_s.length>0)
		{
			if(value_s=="-1")
				document.getElementById("home_x").value="MIN";
			else
				document.getElementById("home_x").value="MAX";
		}
		value_s=get_define_string(line.text,"#define","Y_HOME_DIR");
		if(value_s.length>0)
		{
			if(value_s=="-1")
				document.getElementById("home_y").value="MIN";
			else
				document.getElementById("home_y").value="MAX";
		}
		value_s=get_define_string(line.text,"#define","Z_HOME_DIR");
		if(value_s.length>0)
		{
			if(value_s=="-1")
				document.getElementById("home_z").value="MIN";
			else
				document.getElementById("home_z").value="MAX";
		}
		////////////end stop logic  X_MIN_ENDSTOP_INVERTING
		value_s=get_define_string(line.text,"#define","X_"+document.getElementById("home_x").value+"_ENDSTOP_INVERTING");
		if(value_s.length>0)
			document.getElementById("logic_x").value=value_s;
		value_s=get_define_string(line.text,"#define","Y_"+document.getElementById("home_y").value+"_ENDSTOP_INVERTING");
		if(value_s.length>0)
			document.getElementById("logic_y").value=value_s;
		value_s=get_define_string(line.text,"#define","Z_"+document.getElementById("home_z").value+"_ENDSTOP_INVERTING");
		if(value_s.length>0)
			document.getElementById("logic_z").value=value_s;

		
		
	  //////////////////////BLTOUCH
		value_s=get_define_enable(line.text,"#define","BLTOUCH");
	    if(value_s.length>0) 
	    {
	    	
	    	document.getElementById("BLTOUCH").value=value_s;
	    }
	  //////////////////////SENSORLESS_HOMING
		value_s=get_define_enable(line.text,"#define","SENSORLESS_HOMING");
	    if(value_s.length>0) 
	    {
	    	
	    	document.getElementById("SENSORLESS_HOMING").value=value_s;
		
	    }
	///////////////////////	
		value_s=get_define_string(line.text,"#define","X_STALL_SENSITIVITY");
		if(value_s.length>0)
		{
			if(document.getElementById("SENSORLESS_HOMING").value=="Enable")
			{
				document.getElementById('x_sen').removeAttribute("disabled");
				document.getElementById('y_sen').removeAttribute("disabled");
			}
			else
			{
				document.getElementById('x_sen').setAttribute("disabled","disabled");
				document.getElementById('y_sen').setAttribute("disabled","disabled");
			}
			document.getElementById("x_sen").value=value_s;
		}

		value_s=get_define_string(line.text,"#define","Y_STALL_SENSITIVITY");
		if(value_s.length>0)
			document.getElementById("y_sen").value=value_s;
		value_s=get_define_string(line.text,"#define","X_CURRENT_PI");
		if(value_s.length>0)
			document.getElementById("x_current").value=value_s;

		value_s=get_define_string(line.text,"#define","Y_CURRENT_PI");
		if(value_s.length>0)
			document.getElementById("y_current").value=value_s;

		value_s=get_define_string(line.text,"#define","Z_CURRENT_PI");
		if(value_s.length>0)
			document.getElementById("z_current").value=value_s;

		value_s=get_define_string(line.text,"#define","E0_CURRENT_PI");
		if(value_s.length>0)
			document.getElementById("e_current").value=value_s;

        value_s=get_define_string(line.text,"#define","DEFAULT_AXIS_STEPS_PER_UNIT");
		if(value_s.length>0)
		{
			value_s=value_s.replace(/\{/, "");
			value_s=value_s.replace(/\}/, "");
			var step_n=value_s.split(","); 
			console.log(step_n); 
			document.getElementById("x_step").value=step_n[0];
			document.getElementById("y_step").value=step_n[1];
			document.getElementById("z_step").value=step_n[2];
			document.getElementById("e_step").value=step_n[3];
		}
   ///////////////////
		


     });
		
	
}


function save_easy()
{
	

}


