var board=new Array();
var score=0;
var hasConflicted=new Array();
var startx=0,starty=0;
var endx=0,endy=0;

$(document).ready(function(){
	newgame();
});

function newgame(){
	prepareForMobile();
	//初始化
	init();
	//随机生成2或4
	generate();
	generate();
}
function prepareForMobile(){
	if(documentWidth>500){
		gap=20;
		cellWidth=100;
		contentWidth=500;
	}
	$(".content").css({
		"width":contentWidth-2*gap,
		"height":contentWidth-2*gap,
		"padding":gap
	});
	$(".cell").css({
		"width":cellWidth,
		"height":cellWidth
	});
}

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var cell=$("#cell-"+i+j);
			cell.css({
				"top":getTop(i, j),
				"left":getLeft(i, j)
			})
		}
	}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}
	updateBoardView();
	score=0;
	updateScore(score);
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$(".content").append("<div class='number-cell' id='number-cell-"+i+j+"'></div>");//注意单双引号
			var numberCell=$("#number-cell-"+i+j);
			if(board[i][j]==0){
				numberCell.css({
					"width":"0px",
					"height":"0px",
					"top":getTop(i,j)+0.5*cellWidth,
					"left":getLeft(i, j)+0.5*cellWidth
				});
			}	
			else{
				numberCell.css({
					"width":cellWidth,
					"height":cellWidth,
					"top":getTop(i,j),
					"left":getLeft(i, j),
					"background-color":getBgColor(board[i][j]),
					"color":getColor(board[i][j])
				});
				numberCell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
	}
	$(".number-cell").css({
		"line-height":cellWidth+"px",
		"font-size":0.6*cellWidth+"px"		
	});//若放循环里要两种情况都添加，==0和!=0,若是只在else里初始显示css无间距字号属性
}

function generate(){
	if(nospace(board))
		return false;
	//随机位置
	var x=parseInt(Math.floor(Math.random()*4));
	var y=parseInt(Math.floor(Math.random()*4));//0 1 2 3
	var times=0;
	while(times<50){
		if(board[x][y]==0)
			break;
		x=parseInt(Math.floor(Math.random()*4));
		y=parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times==50){
		for(var i=0;i<4;i++)
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					x=i;
					y=j;//指定位置
				}
			}
	}

	//随机数字2或4
	var randN=Math.random()<0.5?2:4;

	//show
	board[x][y]=randN;
	showNumberWithAnimation(x,y,randN);
	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		//left up right down
		case 37:
			event.preventDefault();
			if(moveLeft()){
				generate();
				isGameOver();
			}
			break;
		case 38:
			event.preventDefault();
			if(moveUp()){
				generate();
				isGameOver();
			}
			break;
		case 39:
			event.preventDefault();
			if(moveRight()){
				generate();
				isGameOver();
			}
			break;
		case 40:
			event.preventDefault();
			if(moveDown()){
				generate();
				isGameOver();
			}
			break;
		default:break;
	}
});
document.addEventListener("touchstart",function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});
document.addEventListener("touchmove",function(event){
	event.preventDefault();//bug
});
document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	var deltax=endx-startx;
	var deltay=endy-starty;
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
		return;
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			if(moveRight()){
				generate();
				isGameOver();
			}
		}
		else{
			if(moveLeft()){
				generate();
				isGameOver();
			}
		}
	}
	else{
		if(deltay>0){
			if(moveDown()){
				generate();
				isGameOver();
			}
		}
		else{
			if(moveUp()){
				generate();
				isGameOver();
			}
		}
	}
});
function isGameOver(){
	if(nospace(board)&&nomove(board))
		alert("Game Over!\n"+"score:"+score);
}
function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	for(var i=0;i<4;i++)
        for(var j=1;j<4;j++)
        	if(board[i][j]!=0)
        		//k..j
        		for(var k=0;k<j;k++){
        			if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
        				showMoveAnimation(i,j,i,k);//ik←ij
        				board[i][k]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}
        			else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
        				showMoveAnimation(i,j,i,k);//ik←ij
        				board[i][k]+=board[i][j];
        				board[i][j]=0;
        				score+=board[i][k];
        				updateScore(score);
        				hasConflicted[i][k]=true;
        				continue;
        			}
        		}
    setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;
	for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--)
        	if(board[i][j]!=0)
        		//j..k
        		for(var k=3;k>j;k--){
        			if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
        				showMoveAnimation(i,j,i,k);//ij→ik
        				board[i][k]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}
        			else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
        				showMoveAnimation(i,j,i,k);//ij→ik
        				board[i][k]+=board[i][j];
        				board[i][j]=0;
        				score+=board[i][k];
        				updateScore(score);
        				hasConflicted[i][k]=true;
        				continue;
        			}
        		}
    setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board))
		return false;
    for(var j=0;j<4;j++)
    	for(var i=1;i<4;i++)
        	if(board[i][j]!=0)
        		//j上k下
        		for(var k=0;k<i;k++){
        			if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
        				showMoveAnimation(i,j,k,j);//from ij to kj
        				board[k][j]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}
        			else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
        				showMoveAnimation(i,j,k,j);//from ij to kj
        				board[k][j]+=board[i][j];
        				board[i][j]=0;
        				score+=board[k][j];
        				updateScore(score);
        				hasConflicted[k][j]=true;
        				continue;
        			}
        		}
    setTimeout("updateBoardView()",200);
	return true;
}
function moveDown(){
	if(!canMoveDown(board))
		return false;
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--)
        	if(board[i][j]!=0)
        		//k上j下
        		for(var k=3;k>i;k--){
        			if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
        				showMoveAnimation(i,j,k,j);//from ij to kj
        				board[k][j]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}
        			else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
        				showMoveAnimation(i,j,k,j);//from ij to kj
        				board[k][j]+=board[i][j];
        				board[i][j]=0
        				score+=board[k][j];
        				updateScore(score);
        				hasConflicted[k][j]=true;
        				continue;
        			}
        		}
    setTimeout("updateBoardView()",200);
	return true;
}