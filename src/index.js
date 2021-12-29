class Game {
    constructor () {    
        this.production = window.PRODUCTION
        if (this.production) {
            console.log('PRODUCTION VERSION')
        } else {
            console.log('DEVELOPMENT VERSION')
        }
    }
  
    async init () {
        console.log('START LOADING GAME');
    }
  
   
  }
  
  window.onload = () => {
    const game = new Game()
    game.init()
  }
  