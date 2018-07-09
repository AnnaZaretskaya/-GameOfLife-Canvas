$(document).ready(function() {
    world.updateOptions();
    data.init(world.options);
    world.initRenderCanvas(world.options);
    world.subscribe();
});

var data = {
    currentMatrix: [],
    nextMatrix:[],

    init: function(options) {
        for(var i = 0; i < options.worldHeight; i++){
            this.currentMatrix[i] = [];
            this.nextMatrix[i] = [];
            for(var j = 0; j < options.worldWidth; j++){
                this.currentMatrix[i][j] = 0;
                this.nextMatrix[i][j] = 0;
            }
        }
    },

    createNextGeneration: function(options) {
        console.log('createNextGeneration response');

        // чтоб не перебирать все случаи во второй части цикла
        for (var i = 0; i < options.worldHeight; i++) {
            for (var j = 0; j < options.worldWidth; j++) {
                this.nextMatrix[i][j] = this.currentMatrix[i][j];
            }
        }
        var liveNeighbor;
        for (var i = 0; i < options.worldHeight; i++) {
            for (var j = 0; j < options.worldWidth; j++) {
                liveNeighbor = 0;
                try {
                    if ((this.currentMatrix[i - 1][j - 1]) && (this.currentMatrix[i - 1][j - 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i - 1][j]) && (this.currentMatrix[i - 1][j] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i - 1][j + 1]) && (this.currentMatrix[i - 1][j + 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i][j - 1]) && (this.currentMatrix[i][j - 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i][j + 1]) && (this.currentMatrix[i][j + 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i + 1][j - 1]) && (this.currentMatrix[i + 1][j - 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i + 1][j]) && (this.currentMatrix[i + 1][j] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                try {
                    if ((this.currentMatrix[i + 1][j + 1]) && (this.currentMatrix[i + 1][j + 1] === 1)) {
                        liveNeighbor += 1;
                    }
                } catch (e) {}
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor <= 1)) {
                    this.nextMatrix[i][j] = 0;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor === 2)) {
                    this.nextMatrix[i][j] = 1;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor === 3)) {
                    this.nextMatrix[i][j] = 1;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor >= 4)) {
                    this.nextMatrix[i][j] = 0;
                }
                if ((this.currentMatrix[i][j] === 0) && (liveNeighbor === 3)) {
                    this.nextMatrix[i][j] = 1;
                }
            }
        }
        for (var i = 0; i < options.worldHeight; i++) {
            for (var j = 0; j < options.worldWidth; j++) {
                this.currentMatrix[i][j] = this.nextMatrix[i][j];
            }
        }
    },
};

var world = {
    config: {
        table: 'main table',
        startButton: '.start',
        pauseButton: '.pause',
        stopButton: '.stop',
        container: 'main',
        speedInput: 'aside .speed',
        widthInput: 'aside .width',
        heightInput: 'aside .height',
        timerId: 0,
        isRunnung: false,
        canvas: document.getElementById('canvas')
    },

    options: {},

    subscribe: function(){
        $(this.config.startButton).on('click', this.start.bind(this));
        $(this.config.pauseButton).on('click', this.pause.bind(this));
        $(this.config.stopButton).on('click', this.stop.bind(this));
        $(this.config.widthInput).on('change', this.changeSize.bind(this));
        $(this.config.heightInput).on('change', this.changeSize.bind(this));
        $(this.config.speedInput).on('change',  function() {
            this.updateOptions();
            if (this.config.isRunnung) {
                window.clearInterval(this.config.timerId);
                this.start();
            }
        }.bind(this) );
        this.config.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    },

    start: function() {
        console.log('world is running');
        this.config.timerId = window.setInterval(this.updateWorld.bind(this), this.options.speed);
        this.config.isRunnung = true;
    },

    pause: function(){
        console.log('world is paused');
        window.clearInterval(this.config.timerId);
        this.config.isRunnung = false;
    },

    stop: function(){
        console.log('world is stoped');
        window.clearInterval(this.config.timerId);
        data.init(world.options);
        this.config.isRunnung = false;
        this.renderMatrix(data.currentMatrix);
    },

    updateOptions: function(){
        this.options.speed = $(this.config.speedInput).val();
        this.options.worldWidth = $(this.config.widthInput).val();
        this.options.worldHeight = $(this.config.heightInput).val();
        return this.options;
    },

    changeSize: function() {
        this.stop();
        this.updateOptions();
        data.init(world.options);
        this.initRenderCanvas(world.options);
    },

    initRenderCanvas: function(options) {
        if (this.config.canvas.getContext) {
            this.config.canvas.width = options.worldWidth * 20;
            this.config.canvas.height = options.worldHeight * 20;
            var ctx = this.config.canvas.getContext('2d');
            for (var i = 0; i < options.worldHeight; i++) {
                for (var j = 0; j < options.worldWidth; j++) {
                    ctx.strokeRect(j * 20, i * 20, 20, 20);
                }
            }
        }
    },

    updateWorld: function() {
        data.createNextGeneration(this.options);
        this.renderMatrix(data.currentMatrix);
    },

    renderMatrix: function(matrix) {
        var ctx = this.config.canvas.getContext('2d');
        for (var i = 0; i < this.options.worldHeight; i++) {
            for (var j = 0; j < this.options.worldWidth; j++) {
                if (matrix[i][j] === 1) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                }
                if (matrix[i][j] === 0) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.fillStyle = "white";
                    ctx.fillRect(j * 20+1, i * 20+1, 20-2, 20-2);
                    // не работает(((((
                    /*ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.fillRect(j * 20, i * 20, 20, 20);*/
                }
            }
        }
    },



    handleCanvasClick: function(event) {
        var curRow = Math.ceil((event.pageY - event.target.offsetTop) / 20)-1;
        var curCol = Math.ceil((event.pageX - event.target.offsetLeft) / 20)-1;
        console.log('x = ', curCol, 'y = ', curRow);

        // try is here to avoid errors when mouse movements happens over few cells
        try {
            data.currentMatrix[curRow][curCol] = (data.currentMatrix[curRow][curCol] + 1) % 2;
        }
        catch (e) {}
        this.renderMatrix(data.currentMatrix);
    }
};
