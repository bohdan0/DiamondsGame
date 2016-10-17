var points = 0;
var board;
var size;
var clicked = false;

$(document).ready(function() {
  getSize();
  firstLoad();
  play();
});

function getSize() {
  while (isNaN(size) || size < 2) {
    size = parseInt(prompt('Enter size of your Board. Size must be GREATER THAN ONE!'));
  }
}

function firstLoad() {
  $('.info').html('Try to burn max amount of blocks with same color. Good luck!');
  makeTableHTML();
  startBoard();
  boardToScr();
}

function play() {
  $('td').click(function() {
    if (clicked == false) {
      clicked = true;
      replaceMaxSequence(parseInt($(this).attr('id')));
      gameStep();
    }
  });
}

function makeTableHTML() {
  var ctr = 0;
  var td = '';
  var table = '';
  for (var i=0; i<size; i++) {
    var tr = '';
    for (var j=0; j<size; j++) {
      td = "<td id='"+ctr+"'></td>";
      tr += td;
      ctr ++;
    }
    tr = '<tr>'+tr+'</tr>';
    table += tr;
  }
  table = "<table class='board'>"+table+"</table>";
  $('body').append(table);
}

function startBoard() {
  board = [];
  for (var i=0; i<size; i++) {
    var row = [];
    for (var j=0;j<size; j++) {
      row.push(generateValue());
    }
    board.push(row);
  }

  if (gameOver()) { startBoard(size) }
}

function generateValue() {
    var colors = ['#EB5D6B','#15A423','#5168DF', '#AC0FB2', '#C8CE0D'];
      if (points < size * 10) {
        colors = colors.slice(0, 3);
      } else if (points < size * 20) {
        colors = colors.slice(0, 4);
      }

    checkDifficulty(colors.length);
    var random = Math.floor(Math.random() * (colors.length));

    return colors[random];
}

function checkDifficulty(level) {
  switch(level) {
  case 3:
    $('body').css('background', '#62F97B');
    break;
  case 4:
    $('body').css('background', '#F9DA41');
    break;
  case 5:
    $('body').css('background', '#E64545');
    break;
  }

  $('.level').html('Your difficulty: '+level+' colors');
}

function boardToScr() {
	var idIdx = 0;
	for (var row_idx=0; row_idx<board.length; row_idx++) {
  	for (var col_idx=0; col_idx<board[row_idx].length; col_idx++) {
    	$(('#'+idIdx).toString()).css('background', board[row_idx][col_idx]);
      idIdx++;
    }
  }
}

function gameStep() {
  setTimeout(function() {
    $('.info').html('Total score: '+points);
    $('td').removeClass('winComb');
    boardToScr();
      if (gameOver()) {
        $('.info').html('GAME OVER! Total score: '+points);
        $('body').css('background', '#956004');
        stopPropagation();
      }
    clicked = false;
  }, 700);
}

function lightMaxSequence(arr) {
  var id = arr[0] * size + arr[1];
	$('#'+id.toString()).addClass('winComb');
}

function gameOver() {
  for (var row_idx=0; row_idx<size; row_idx++) {
    for (var col_idx=0; col_idx<size-1; col_idx++) {
      if (board[row_idx][col_idx] == board[row_idx][col_idx+1] || board[col_idx][row_idx] == board[col_idx+1][row_idx]) {
        return false;
      }
    }
  }

  return true;
}

function replaceMaxSequence(id) {
  var row_idx = Math.floor(id / size);
  var col_idx = id % size;
  var clicked = board[row_idx][col_idx];
  var result = [ [row_idx, col_idx] ];
  var up = 1, right = 1, bottom = 1, left = 1;

  while (row_idx-up >= 0 && clicked == board[row_idx-up][col_idx]) {
    result.push([row_idx-up, col_idx]);
    up++;
  }
  while (clicked == board[row_idx][col_idx+right]) {
    result.push([row_idx, col_idx+right]);
    right++;
  }
  while (row_idx+bottom < size && clicked == board[row_idx+bottom][col_idx]) {
    result.push([row_idx+bottom, col_idx]);
    bottom++;
  }
  while (clicked == board[row_idx][col_idx-left]) {
    result.push([row_idx, col_idx-left]);
    left++;
  }

  if (result.length == 1) {
    return $('.info').html('Too short sequence! Choose sequence of two or more');
  }

  countPoints(result.length);

  result = result.sort();

  for (var i=0; i<result.length; i++) {
    lightMaxSequence(result[i]);

    row_idx = result[i][0];
    col_idx = result[i][1];

      while (row_idx > 0) {
        takeUpperBackground([row_idx, col_idx]);
        row_idx--;
      }

    board[row_idx][col_idx] = generateValue();
  }
}

function takeUpperBackground (arr) {
  var row_idx = arr[0];
  var col_idx = arr[1];
  board[row_idx][col_idx] = board[row_idx-1][col_idx];
}

function countPoints(currScore) {
  points += currScore;
  $('.info').html('Score on this board: '+currScore);
}
