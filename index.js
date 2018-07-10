$(document).ready(function() {
    world.updateOptions();
    data.init(world.options);
    world.initRenderCanvas(world.options);
    world.subscribe();
});

var data = {
    currentMatrix: [],
    nextMatrix:[],
    // i add this delta - matrix of changes
    delta: [],

    init: function(options) {
        for(let i = 0; i < options.worldHeight; i++){
            this.currentMatrix[i] = [];
            this.nextMatrix[i] = [];
            this.delta[i] = [];
            for(let j = 0; j < options.worldWidth; j++){
                this.currentMatrix[i][j] = 0;
                this.nextMatrix[i][j] = 0;
                this.delta[i][j] = 0
            }
        }
    },

    createNextGeneration: function(options) {
        // чтоб не перебирать все случаи во второй части цикла
        this.nextMatrix = Object.assign([], this.currentMatrix);

        /*
        was
        for (let i = 0; i < options.worldHeight; i++) {
            for (let j = 0; j < options.worldWidth; j++) {
                this.nextMatrix[i][j] = this.currentMatrix[i][j];
            }
        }
        */

        // Vitalii has better solution, he has separate summ-function over array of indexes
        let liveNeighbor;

        /*
        i should use this iteration, but i think in this case for-loops looks more clearly and visually
        this.currentMatrix.forEach(function(matrixRow, i, matrix) {
            matrixRow.forEach(function(cell, j, row) {
            })
        });
        */
        for (let i = 0; i < options.worldHeight; i++) {
            for (let j = 0; j < options.worldWidth; j++) {
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
                    this.delta[i][j] = -1;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor === 2)) {
                    this.nextMatrix[i][j] = 1;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor === 3)) {
                    this.nextMatrix[i][j] = 1;
                }
                if ((this.currentMatrix[i][j] === 1) && (liveNeighbor >= 4)) {
                    this.nextMatrix[i][j] = 0;
                    this.delta[i][j] = -1;
                }
                if ((this.currentMatrix[i][j] === 0) && (liveNeighbor === 3)) {
                    this.nextMatrix[i][j] = 1;
                    this.delta[i][j] = 1;
                }
            }
        }



        this.currentMatrix = Object.assign([], this.nextMatrix);
        /*
        was
        for (let i = 0; i < options.worldHeight; i++) {
            for (let j = 0; j < options.worldWidth; j++) {
                this.currentMatrix[i][j] = this.nextMatrix[i][j];
            }
        }
        */
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
                this.config.isRunnung = false;
                this.start();
            }
        }.bind(this) );
        this.config.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    },

    start: function() {
        console.log('world is running', this.config.isRunnung);
        if (this.config.isRunnung === true) {
            return;
        }
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
        this.updateOptions();
        this.initRenderCanvas(this.options);
        let tempCurrentMatrix = [];
        let tempNextMatrix = [];
        let tempDelta = [];
        for(let i = 0; i < this.options.worldHeight; i++){
            tempCurrentMatrix[i] = [];
            tempNextMatrix[i] = [];
            tempDelta[i] = [];
            for(let j = 0; j < this.options.worldWidth; j++){
                tempCurrentMatrix[i][j] = 0;
                tempNextMatrix[i][j] = 0;
                tempDelta[i][j] = 0;
                try {tempCurrentMatrix[i][j] = data.currentMatrix[i][j] || 0}
                catch (e) {}
                try {tempNextMatrix[i][j] = data.nextMatrix[i][j] || 0}
                catch (e) {}
                try {tempDelta[i][j] = data.delta[i][j] || 0}
                catch (e) {}
            }
        }
        data.currentMatrix = Object.assign([], tempCurrentMatrix);
        data.nextMatrix = Object.assign([], tempNextMatrix);
        data.delta = Object.assign([], tempDelta);
        /*
        was
        this.stop();
        this.updateOptions();
        data.init(world.options);
        this.initRenderCanvas(world.options);
        */
    },

    initRenderCanvas: function(options) {
        if (this.config.canvas.getContext) {
            this.config.canvas.width = options.worldWidth * 20;
            this.config.canvas.height = options.worldHeight * 20;
            let ctx = this.config.canvas.getContext('2d');

            for (let i = 0; i < options.worldHeight; i++) {
                for (let j = 0; j < options.worldWidth; j++) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.fillStyle = "white";
                    ctx.fillRect(j * 20, i * 20, 20-1, 20-1);
                    // was
                    // ctx.strokeRect(j * 20, i * 20, 20, 20);
                }
            }
            ctx.beginPath();
            ctx.moveTo(this.options.worldWidth * 20, 0);
            ctx.lineTo(0, 0);
            ctx.lineTo(0, this.options.worldHeight * 20);
            ctx.stroke();
        }
    },

    updateWorld: function() {
        data.createNextGeneration(this.options);
        //this.renderMatrix(data.currentMatrix);
        this.renderDelta(data.delta);
    },

    // i add this function
    renderDelta: function(matrix) {
        let ctx = this.config.canvas.getContext('2d');
        for (let i = 0; i < this.options.worldHeight; i++) {
            for (let j = 0; j < this.options.worldWidth; j++) {
                if (matrix[i][j] === 1) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20-1, 20-1);
                }
                if (matrix[i][j] === 0) {
                    continue;
                }
                if (matrix[i][j] === -1) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(j * 20, i * 20, 20-1, 20-1);
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(this.options.worldWidth * 20, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, this.options.worldHeight * 20);
        ctx.stroke();
    },

    renderMatrix: function(matrix) {
        let ctx = this.config.canvas.getContext('2d');
        for (let i = 0; i < this.options.worldHeight; i++) {
            for (let j = 0; j < this.options.worldWidth; j++) {
                if (matrix[i][j] === 1) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20-1, 20-1);
                }
                if (matrix[i][j] === 0) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(j * 20, i * 20, 20-1, 20-1);

                    /*was
                    ctx.fillStyle = "black";
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.fillStyle = "white";
                    ctx.fillRect(j * 20+1, i * 20+1, 20-2, 20-2);
                    */
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(this.options.worldWidth * 20, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, this.options.worldHeight * 20);
        ctx.stroke();
    },



    handleCanvasClick: function(event) {
        let curRow = Math.ceil((event.pageY - event.target.offsetTop) / 20)-1;
        let curCol = Math.ceil((event.pageX - event.target.offsetLeft) / 20)-1;


        // try is here to avoid errors when mouse movements happens over few cells
        try {
            data.currentMatrix[curRow][curCol] = (data.currentMatrix[curRow][curCol] + 1) % 2;
        }
        catch (e) {}
        this.renderMatrix(data.currentMatrix);
    }
};

