// This Snake game was created by the following author: http://www.andrespagella.com/snake-game 
// I've modified the code a bit and found a way to add graphics for the head and tail of the snake
// I could not find a suitable method of scaling up the quality of the images in the canvas
// as a result they look blurry, I've tried a few fixes to no avail. I've also left a lot of comments
// that along with Andres's article may help you understand what's going on.


window.onload = function(){

	var snake_canvas = document.getElementById('snake_canvas'),
        context = snake_canvas.getContext('2d'),
 		score = 0,
 		level = 0,
 		direction = 0,
 		snake = new Array(3),
 		active = true,
 		speed = 500;

 	var image_cat_head = document.images[0]; // Loading the images this way is surely a bad practice but for now...
 	var image_mouse = document.images[1];
 


 	var matrix = new Array(20); // Create the matrix which we'll use to drive our logic
	for (var i = 0; i < matrix.length; i++) {
			matrix[i] = new Array(20);
	}


    snake_canvas.width = 204; // Setting this to a different value will cause problems with the array im afraid!
    snake_canvas.height = 224; // Offset to allow for our score and level to appear, but not on the board itself
	
    snake_canvas.style.width = '450px'; // bumps up the scale of our canvas, but everything still looks blurry!
	snake_canvas.style.height = '450px';

	

    var body = document.getElementsByTagName('body')[0];
	var container = document.getElementById('container')
	container.appendChild(snake_canvas);

	
	matrix = gen_Snake(matrix)
	matrix = gen_Food(matrix); // The original matrix has random food co-ord's assigned and is passed back into the global matrix var

	draw_Game();

	window.addEventListener('keydown', function(e){
	
		  if (e.keyCode === 38 && direction !== 3) {
			direction = 2; //up
			
		} else if (e.keyCode === 40 && direction !== 2) {
        	direction = 3; // Down
        	
   		} else if (e.keyCode === 37 && direction !== 0) {
       		 direction = 1; // Left
       		 
    	} else if (e.keyCode === 39 && direction !== 1) {
        	 direction = 0; // Right
        	 
    	}
		
	});

	function draw_Game(){

		context.clearRect(0, 0, snake_canvas.width, snake_canvas.height) // Clears the entire canvas
	

		// start from the last snake piece
		for (var i = snake.length - 1; i >= 0; i--) {
			//if we're at snakes head...



			if (i === 0){

				switch(direction) {
					case 0: //heading right
						// The head is assigned an object with 2 properties, x and y which store the co-ords
						// In going right we increment the orginal value by 1, y is left the same
						snake[0] = {x: snake[0].x + 1, y: snake[0].y}
						break;
					case 1: //heading left
						snake[0] = {x: snake[0].x - 1, y: snake[0].y}
						break;
					case 2: //heading up
						snake[0] = {x: snake[0].x, y: snake[0].y - 1}
						break;
					case 3: //heading down
						snake[0] = {x: snake[0].x, y: snake[0].y + 1}
						break;
				}

				// Check if our snake is in the valid area. If he exits the area - GAME OVER MAN!
				// If snake.x is over 20 it means he's gone over the array
				if (snake[0].x < 0 || 
					snake[0].x > 19 || 
					snake[0].y < 0 || 
					snake[0].y > 19){

					game_over()
					return;

				}

				// what happens when we hit food, increase score, reset gen_food
				// increase snake length
				if (matrix[snake[0].x][snake[0].y] === 1){
					score = score + 10
					matrix = gen_Food(matrix);

					//increase the snake's size, we target the snake properties.
					snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
					// This line sets our new piece to "2" as we do when a whole new snake is generated
					matrix[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

					// Increase the level
					if ((score % 100) == 0) {
						level = level + 1;
					}


				}// if the snake tries to eat itself! we end the game
					else if (matrix[snake[0].x][snake[0].y] === 2){
						game_over();
						return;
					}
				// not sure about this line, seems to assign the snake head to the matrix
				matrix[snake[0].x][snake[0].y] = 3;


			} // end direction switch check


				else { // clear the last snake piece from the matrix

					if (i === (snake.length - 1)){
						matrix[snake[i].x][snake[i].y] = null;

					}
					// generate the tail graphics - You can set the graphics below
					if (i === (snake.length - 2)){
						 matrix[snake[i].x][snake[i].y] = 4;
					}
					// not sure about these either
					 snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
            		 matrix[snake[i].x][snake[i].y] = 2;


				}

		
		} //end snake cycle

		// draws the border and score
		draw_Main();

		//start cycling the matrix, when our assigned snake or food is found render the items
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix[0].length; y++) {
				if (matrix[x][y] === 1) {
					
					// This draws the food
					context.drawImage(image_mouse, x*10, y*10 +20, 10, 10) // a +20 offset is to keep the snake and food away from the score bar.
					
				}


				else if (matrix[x][y] === 2) { // This draws the body of the snake

					
					context.fillStyle = 'black';
					context.fillRect(x*10, y*10 + 20, 10, 10)


					
				}

				else if (matrix[x][y] === 3) { // This draws the head of the snake, you can change this of course

					context.drawImage(image_cat_head, x*10, y*10 +20, 12, 12)

					
				}

				else if (matrix[x][y] === 4) { // This draws the tail

					context.fillStyle = 'black';
					context.fillRect(x*10, y*10 + 20, 10, 10)
					
				}


			}
		}

		if (active) {
			setTimeout(draw_Game, speed - (level*50));
		}

	} // end draw_game function

	function draw_Main(){

	    context.lineWidth = 2
	    context.strokeStyle = 'black';
	    context.strokeRect(2, 20, snake_canvas.width - 4, snake_canvas.height - 24);

	    context.font = ("12px sans-serif")
	    context.fillText("Score: " + score + " - Level: " + level, 5, 10)
	 
	   
	}

	function gen_Food(matrix){

		var randomX = Math.round(Math.random() * 19),
			randomY = Math.round(Math.random() * 19);

		// Here we're checking that the array position has not already been assigned to our lovely snake.
		// Take a look i the snake function and you'll see that each body piece (array) has 2 assigned.
		// So to stop food appearing on the snake we 're-roll' the random values
		while (matrix[randomX][randomY] === 2){
			randomX = Math.round(Math.random() * 19);
			randomY = Math.round(Math.random() * 19);
		}

		while ((randomX - 1) < 0) {
			
			randomX = Math.round(Math.random() * 19);
		}

		console.log(randomX, randomY)
		// assign our current food position an ID of 1
		matrix[randomX][randomY] = 1
		
		return matrix;

	}

	function gen_Snake(matrix){

		var randomX = Math.round(Math.random() * 19);
			randomY = Math.round(Math.random() * 19);


		while ((randomX - snake.length) < 0) {
			
			randomX = Math.round(Math.random() * 19);
		}

		for (var i = 0; i < snake.length; i++) { // snake length default is 3
			snake[i] = { x: randomX - i, y: randomY }; // for each x value decrement (for a snake.length of 3 by 0,1,2). RandomY doesn't change.
			matrix[randomX - i][randomY] = 2; // assign the value 2 to the matrix grid (for the length of the snake), this is used in the gen_food function to stop the food generating on top of the snake
			if(i === 0){
				matrix[randomX - i][randomY] = 3
				console.log("head")
			} else {console.log("not head")}
			
		}

		return matrix;
	}

	function game_over() {
		active = false
		context.clearRect(0, 0, snake_canvas.width, snake_canvas.height) // Clears the entire canvas
		context.font = ("12px sans-serif")
	    context.fillText("Game Over! Score: " + score, (snake_canvas.width/2) - 20, (snake_canvas.height/2) - 25)
	}




};




