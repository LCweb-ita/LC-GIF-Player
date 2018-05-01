/**
 * lc_gif_player.js - a true Gif Player through SuperGif plugin
 * Version: 1.0
 * Author: Luca Montanari aka LCweb
 * Website: https://lcweb.it
 * Licensed under the MIT license
 */
 
(function() {
	
	/* TODO: on fullscreen switch, keep the viewed frame */
	
	lcgp_count = 0;
	lcgp_instances = [];
	lcgp_cont_move = [];
	lcgp_init_intval = [];
	
	lc_gif_player = function(gif_selector, autoplay, addit_class, to_hide) {
		var objs = document.querySelectorAll(gif_selector);
		if(typeof(to_hide) == 'undefined') {
			to_hide = [];	
		}
		
		for (var i = 0, obj; obj = objs[i]; i++) {
			var true_obj = obj;
			var curr_inst_index = lcgp_count; 
			var gif_src = obj.querySelector('img').getAttribute('rel:animated_src');
			
			obj.setAttribute("data-lcgp-inst", curr_inst_index);
			obj.setAttribute("data-lcgp-src", gif_src);

			obj.classList.add("lcgp_wrap", "lcgp_initialstate", 'lcgp_'+curr_inst_index);
			obj.querySelector('img').setAttribute("data-lcgp-inst", curr_inst_index);
			
			// additional classes
			if(typeof(addit_class) != 'undefined' && addit_class) {
				var arr = addit_class.split(' ');
				
				for(a=0; a < arr.length; a++) {
					if(arr[a]) {
						obj.classList.add( arr[a] );	
					}
				}
			}
			
			var preload 	= new Image();
			preload.parent 	= true_obj;
			preload.inst_id = curr_inst_index;
			preload.src 	= obj.querySelector('img').getAttribute('rel:animated_src');
		
			
			// gif has been loaded - execute
			preload.onload = function() {
				var that = this;
				
				// wait until plugin has been executed in there
				lcgp_init_intval[ that.inst_id ] = setInterval(function() {
					
					if( that.parent.querySelector('.jsgif') ) {
						clearInterval( lcgp_init_intval[ that.inst_id ] );
						
						setTimeout(function() {
							// apply cmds
							var cmd = document.createElement("div");  
							cmd.className = "lcpg_cmd";
							cmd.innerHTML = 
								'<span class="lcgp_play" title="play"></span>'+
								'<span class="lcgp_pause" title="pause"></span>'+
								'<span class="lcgp_stop" title="back to beginning"></span>';
								
							if(to_hide.indexOf('move') === -1) {
							  cmd.innerHTML += 
								'<span class="lcgp_prev" title="hold click to move backward"></span>'+
								'<span class="lcgp_next" title="hold click to move forward"></span>';
							}
							
							if(to_hide.indexOf('fullscreen') === -1) {
							  cmd.innerHTML += 	
								'<span class="lcgp_enter_fs" title="enter fulscreen"></span>'+
								'<span class="lcgp_exit_fs" title="exit fullscreen"></span>';
							}
							
							that.parent.appendChild(cmd);
							lcgp_cmds_actions(that.parent, that.inst_id);
							
							// trigger action to avoid flickering 
							lcgp_instances[ that.inst_id ].move_to(0);
						}, 30);
					}
				}, 30);
			};
			
			
			// init SuperGif plugin
			lcgp_instances[lcgp_count] = new SuperGif({ 
				gif					: obj.querySelector('img'),
				auto_play 			: false,
				progressbar_height	: 0,
				loop_mode			: false,
				rubbable			: false,
				on_end				: function(e) {
					
					var inst = e.attributes['data-lcgp-inst'].value;
					if(document.querySelector('.lcgp_'+ inst)) {
						document.querySelector('.lcgp_'+ inst).querySelector('.lcgp_pause').click();
					}
				}
			});
			
			
			// once laded - show
			lcgp_instances[lcgp_count].load(function(e) {			
				var selector = '.lcgp_'+ e.attributes['data-lcgp-inst'].value;
				
				if(document.querySelector(selector)) {
					lcgp_size_control(selector);
					document.querySelector(selector).classList.add("lcgp_loaded");
					
					// autoplay
					if(typeof(autoplay) != 'undefined' && autoplay) {
						document.querySelector( selector +' .lcgp_play').click();	
					}
				}
			});
			
			lcgp_count++;
		}						
	};
	
	
	
	/* control size limits */
	var lcgp_size_control = function(subj) {
		var selector = (typeof(subj) != 'string') ? '.lcgp_wrap' : subj; 
		var objs = document.querySelectorAll(selector);
		
		for (var i = 0, obj; obj = objs[i]; i++) {
			
			var canvas = obj.querySelector('canvas');
			var jsgif = obj.querySelector('.jsgif');
			
			canvas.style.maxHeight 	= '';
			jsgif.style.maxHeight 	= '';
			jsgif.style.maxWidth	= '';
			
			canvas.style.maxHeight = obj.clientHeight +'px';
			
			var jsgif = obj.querySelector('.jsgif');
			jsgif.style.maxHeight = obj.clientHeight +'px';
			
			jsgif.style.maxWidth = canvas.clientWidth +'px';
		}
	}
	window.addEventListener('resize', lcgp_size_control, false);
	
	
	
	/* commands */
	var lcgp_cmds_actions = function(obj, instance_id) {
		
		// play/plause clicking on gif
		obj.addEventListener("click", function(e) {
			
			if( e.target.classList.contains('lcgp_initialstate') ) {
				this.querySelector('.lcgp_play').click();
			} 
			else if( e.target.tagName == 'CANVAS') {
				(obj.classList.contains('lcgp_paused')) ? this.querySelector('.lcgp_play').click() : this.querySelector('.lcgp_pause').click();
			} 
		});
		
		// play
		obj.querySelector('.lcgp_play').addEventListener("click", function() {
			lcgp_instances[instance_id].play();
			
			obj.classList.add("lcgp_playing");
			obj.classList.remove("lcgp_initialstate", "lcgp_paused");
			
			 var event = new Event('lcgp_play');
   			 obj.dispatchEvent(event);
		});
		
		// pause
		obj.querySelector('.lcgp_pause').addEventListener("click", function() {
			lcgp_instances[instance_id].pause();
			
			obj.classList.add("lcgp_paused");
		});
		
		// stop
		obj.querySelector('.lcgp_stop').addEventListener("click", function() {
			obj.querySelector('.lcgp_pause').click();
			lcgp_instances[instance_id].move_to(0);
			
			obj.classList.remove("lcgp_playing", "lcgp_paused");
			obj.classList.add("lcgp_initialstate");
		});
		
		
		// prev
		if(obj.querySelector('.lcgp_prev')) {
			obj.querySelector('.lcgp_prev').addEventListener("mousedown", function() {
				obj.querySelector('.lcgp_pause').click();
				lcgp_cont_move('prev', instance_id);
			});
			obj.querySelector('.lcgp_prev').addEventListener("mouseup", function() {
				clearInterval( lcgp_cont_move[instance_id] );
			});
		}
		
		// next
		if(obj.querySelector('.lcgp_next')) {
			obj.querySelector('.lcgp_next').addEventListener("mousedown", function() {
				lcgp_instances[instance_id].pause();
				lcgp_cont_move('next', instance_id);
				
				obj.classList.add("lcgp_playing", "lcgp_paused");
				obj.classList.remove("lcgp_initialstate");
			});
			obj.querySelector('.lcgp_next').addEventListener("mouseup", function() {
				clearInterval( lcgp_cont_move[instance_id] );
			});
		}
		
		
		// enter fullscreen
		if(obj.querySelector('.lcgp_enter_fs')) {
			obj.querySelector('.lcgp_enter_fs').addEventListener("click", function() {
				obj.querySelector('.lcgp_pause').click();
				lcgp_enter_fs(obj, instance_id);
			});
		}
		
		// exit fullscreen
		if(obj.querySelector('.lcgp_exit_fs')) {
			obj.querySelector('.lcgp_exit_fs').addEventListener("click", function() {
				document.getElementById('lcgp_fs_wrap').remove();
			});
		}
	};
	
	
	// exit fullscreen on ESC press
	document.onkeydown = function(e) {
		if(!document.getElementById('lcgp_fs_wrap')) {return true;}
		
		e = e || window.event;
		var isEscape = false;
		
		if ("key" in e) {
			isEscape = (e.key == "Escape" || e.key == "Esc");
		} else {
			isEscape = (e.keyCode == 27);
		}
		
		if(isEscape) {
			document.getElementById('lcgp_fs_wrap').remove();
		}
	};
	
	
	
	/* continuous prev/next */
	var lcgp_cont_move = function(direction, instance_id) {
		
		if(typeof( lcgp_cont_move[instance_id] ) != 'undefined') {
			clearInterval( lcgp_cont_move[instance_id] );
		}
		
		// immediate action
		(direction == 'next') ? lcgp_instances[instance_id].move_relative(1) : lcgp_instances[instance_id].move_relative(-1);
		
		// repeating action
		lcgp_cont_move[instance_id] = setInterval(function() {
			
			(direction == 'next') ? lcgp_instances[instance_id].move_relative(1) : lcgp_instances[instance_id].move_relative(-1);
		}, 100);
	};
	
	
	
	
	/* recreate on fullscreen */
	var lcgp_enter_fs = function(obj, instance_id) {
		
		// append code to body
		var img_src = obj.attributes['data-lcgp-src'].value;
		
		var fs_code = document.createElement("div");  
		fs_code.id = "lcgp_fs_wrap";
		fs_code.innerHTML = '<div><img src="" rel:animated_src="'+ img_src +'" /></div>';
		
		document.body.appendChild(fs_code);
		
		var classes = obj.className;
		classes = classes.replace('lcgp_wrap', '').replace('lcgp_initialstate', '').replace('lcgp_loaded', '').replace('lcgp_playing', '').replace('lcgp_paused', '');
		
		
		var to_hide = (obj.querySelector('.lcgp_prev')) ? [] : ['move'];
		lc_gif_player('#lcgp_fs_wrap div', true, classes, to_hide);
		
		
		// exit fullscreen on background click
		document.getElementById('lcgp_fs_wrap').addEventListener("click", function(e) {		
			if( e.target.id == 'lcgp_fs_wrap') {
				this.remove();
			} 
		});
	};
	
}());