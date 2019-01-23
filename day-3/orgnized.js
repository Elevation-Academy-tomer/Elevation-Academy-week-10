class Pokemon{
    constructor(data){
        this.data = data
        this.pokemon =[]
        this.pokemon_type =[]
        this.trainer = []
        this.town = []
        this.pokemon_trainer = []
        this.counter =0
        this.trainerCounter = 0
        this.tempobjType = {}
        this.tempobjTown = {}
        this.tempobjTrainer = {}
    }

    clearTemp(){
        this.counter =0
    }

    createPokemon_type(){
        this.data.filter(pok =>{
            if(!this.tempobjType[pok.type]){
                this.counter++
                this.tempobjType[pok.type] = this.counter,
                this.pokemon_type.push({id : this.counter,
                type : pok.type})
            }
        })
        this.clearTemp()
    }

    createPokemon(){
        this.data.filter(pok =>{
                this.pokemon.push({id : pok.id,
                                   name : pok.name,
                                   type : this.tempobjType[pok.type],
                                   height : pok.height,
                                   weight : pok.weight})
        })
    }

    createTownAndTrainer(){
        this.data.filter(pok =>{
            pok.ownedBy.filter(t => {
                if(!this.tempobjTown[t.town]){
                    this.counter++
                    this.tempobjTown[t.town] = this.counter,
                    this.town.push({id : this.counter,
                                    town_name : t.town})
                }
                if(t && !this.tempobjTrainer[t.name]){
                    this.trainerCounter++
                    this.tempobjTrainer[t.name] = this.trainerCounter
                    this.trainer.push({id : this.trainerCounter,
                                      name : t.name,
                                      town_id : this.counter})
                }
            })
        })
        this.clearTemp()
    }

    createTrainer_Pokemon(){
        this.data.filter(pok =>{
            pok.ownedBy.filter(t => {
                if(t){
                    this.pokemon_trainer.push({pokemon_id : pok.id,
                                               trainer_id : this.tempobjTrainer[t.name]})
                }
            })
        })
    }
}

module.exports = Pokemon;



