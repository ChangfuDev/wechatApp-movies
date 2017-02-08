var waveObj = function()
{
	this.x = [];
	this.y = [];
	this.alive = [];
	//半径
	this.r =[]; 
	this.type = [];
}
waveObj.prototype.num = 10;
waveObj.prototype.init = function()
{
	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.r[i] =0;
	}
}

waveObj.prototype.draw = function()
{
	for (var i = 0; i < this.num; i++) {
		if (this.alive[i]) 
		{
			ctx1.save();
			ctx1.shadowBlur = 10;

			//与果实碰撞的效果
			if (this.type[i] == 1) 
			{
				this.r[i] += deltaTime * 0.05;

				if (this.r[i] > 40) 
				{
					this.alive[i] = false;
					break;
				}

				var alpha = 1 - this.r[i] / 40;
				var color = "rgba(255,255,255," ;
				ctx1.lineWidth = 2;
				ctx1.shadowColor = "white";

			} 
			else if (this.type[i] == 0)  //与小鱼碰撞的效果
			{
				this.r[i] += deltaTime * 0.1;

				if (this.r[i] > 100) 
				{
					this.alive[i] = false;
					break;
				}
				//透明度与半径成反比关系
				var alpha = 1 - this.r[i] / 100;
				var color = "rgba(255,52,13," ;
				ctx1.lineWidth = 3;
				ctx1.shadowColor = "#ff340d";
			}
			
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i], this.r[i], 0, 2*Math.PI);
			ctx1.closePath();
			ctx1.strokeStyle = color + alpha + ")";
			ctx1.stroke();
			ctx1.restore();
		}
	}
}

waveObj.prototype.born = function(x, y, z)
{
	for (var i = 0; i < this.num; i++) {

		if (!this.alive[i]) 
		{
			//born
			this.r[i] = 10;
			this.x[i] = x;
			this.y[i] = y;
			this.type[i] = z;
			this.alive[i] = true;
			return;
		}

	}
}