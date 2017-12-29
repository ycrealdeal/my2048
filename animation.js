function showNumberWithAnimation(i,j,number){
	var numberCell=$("#number-cell-"+i+j);
	numberCell.css({
		"background-color":getBgColor(number),
		"color":getColor(number)
	});
	numberCell.text(number);
	numberCell.animate({
		width:cellWidth,
		height:cellWidth,
		top:getTop(i, j),
		left:getLeft(i, j)
	},100);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$("#number-cell-"+fromx+fromy);
	numberCell.animate({
		top:getTop(tox, toy),
		left:getLeft(tox, toy)
	},200);
}
function updateScore(score) {
	$("#score").text(score);
}