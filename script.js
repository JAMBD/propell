var fixed_row_state = [1, 2, 1, 1, 2, 2, 2];
var slots = fixed_row_state.length;
var layers = 4;
var layer_groups = [0, 1, 1, 2];
var layer_colours = [
  "#844",
  "#484",
  "#448"];
var state = [];
var selected_group = 0;

var pattern = document.createElement("canvas");

function get_index(layer, slot){
  return layer * slots + slot;
}

function resolve_state(){
  for (var i=0; i<slots; i++){
    var init_pos = [];
    var end_pos = [];
    var dir = [];
    for (var j=0; j<layers; j++){
      var s = state[get_index(j,i)];
      if (s > 0){
        init_pos.push(j);
        end_pos.push(j);
        dir.push((s-1.5)*2);
      }
      state[get_index(j,i)] = 0;
    }
    if (init_pos.length == 2){
      if (dir[0] == dir [1]){
        end_pos[1] = 1;
      }else{
        end_pos[1] = 3;
      }
    }
    if (init_pos.length == 3){
      if (dir[0] == dir[1]){
        end_pos[1] = 1;
        if (dir[1] == dir[2]){
          end_pos[2] = 2;
        }else{
          end_pos[2] = 3;
        }
      }else{
        end_pos[2] = 3;
        if (dir[1] == dir[2]){
          end_pos[1]= 2;
        }else{
          if (dir[2] > 0){
            end_pos[1] = 2;
          }else{
            end_pos[1] = 1;
          }
        }
      }
    }
    for (var j=0; j<end_pos.length; j++){
      state[get_index(end_pos[j], i)] = (dir[j]/2)+1.5;
    }
  }
}

function rotate_group(group){
  for (var i=0; i<layers; i++){
    if (layer_groups[i] == group){
      var tmp = state[get_index(i, 0)];
      for (var j=0; j<slots-1; j++){
        state[get_index(i, j)] = state[get_index(i, j + 1)];
      }
      state[get_index(i,slots-1)] = tmp;
    }
  }
}

function keyDownEvent(e){
  switch(e.keyCode){
    case 32: 
      //space
      break;
    case 38: 
      //up
      selected_group = ((selected_group - 1) + layer_colours.length) % layer_colours.length;
      break;
    case 40: 
      //down
      selected_group = (selected_group + 1) % layer_colours.length;
      break;
    case 39: 
      //right
      //too lazy to write the other direction`
      for (var i=0; i<slots-1; i++){
        rotate_group(selected_group);
      }
      break;
    case 37: 
      //left
      rotate_group(selected_group);
      break;
  }
  resolve_state();
}

function keyUpEvent(e){
}

function draw_pattern(ctx){
  pattern.width = 5;
  pattern.height = 5;
  var pctx = pattern.getContext("2d");
  pctx.strokeStyle = ctx.strokeStyle;
  pctx.fillStyle = ctx.fillStyle;
  pctx.fillRect(0,0,5,5);
  pctx.beginPath();
  pctx.moveTo(0,0);
  pctx.lineTo(5,5);
  pctx.moveTo(5,0);
  pctx.lineTo(0,5);
  pctx.stroke();
  ctx.fillStyle = ctx.createPattern(pattern,"repeat");
}
function setup(){
  var c = document.getElementById("game");
  window.addEventListener('keydown', keyDownEvent, false);
  window.addEventListener('keyup', keyUpEvent, false);
  window.addEventListener('resize', resizeCanvas, false);
  setInterval(function() {
    update();
    draw();
  }, 30);
  resizeCanvas();

  for (var i=0; i<layers; i++){
    for (var j=0; j<slots; j++){
      if (i < 2){
        state.push(fixed_row_state[j]);
      }else{
        state.push(0);
      }
    }
  }
}

function draw(){
  var c = document.getElementById("game");
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = "#012";
  ctx.fillRect(0,0,c.width,c.height);
  for (var i=0; i<layers; i++){
    ctx.fillStyle = layer_colours[layer_groups[i]];
    ctx.strokeStyle = "#333";
    if (layer_groups[i] != selected_group){
      draw_pattern(ctx);
    }
    ctx.fillRect(0,c.height/(layers+2)*(i+1),c.width,c.height/(layers+2));
  }
  for (var i=0; i<layers; i++){
    for (var j=0; j<slots; j++){
      var ix = get_index(i, j);
      var h = c.height / (layers + 2);
      var w = c.width / (slots * 2);
      var y = h * (i + 1);
      var x = w * j * 2 + w / 2;

      switch (state[ix]){
        case 0:
          ctx.fillStyle = "#333";
          ctx.fillRect(x,y,w,h);
          break;
        case 1:
          ctx.fillStyle = "#633";
          ctx.fillRect(x,y,w,h);
          ctx.fillStyle = "#336";
          ctx.fillRect(x,y,w,h/2);
          ctx.fillStyle = "#A75";
          ctx.fillRect(x,y+(h/5),w,h/5*3);
          break;
        case 2:
          ctx.fillStyle = "#336";
          ctx.fillRect(x,y,w,h);
          ctx.fillStyle = "#633";
          ctx.fillRect(x,y,w,h/2);
          ctx.fillStyle = "#776";
          ctx.fillRect(x,y+(h/5),w,h/5*3);
          break;
      }
    }
  }
}

function resizeCanvas(){
  var ratio = 2.0;
  var c = document.getElementById("center");
  var game = document.getElementById("game");
  min_len = Math.min(window.innerWidth / ratio,window.innerHeight);
  c.width = min_len * ratio;
  c.height = min_len;
  c.style.width = min_len * ratio + 'px';
  c.style.height = min_len + 'px';
  game.width = min_len * ratio;
  game.height = min_len;
  game.style.width = min_len * ratio + 'px';
  game.style.height = min_len + 'px';
  scl = min_len / 1024.0;
  draw();
}


function update(){
}

setup();

