const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://tomeraitz:12345678@fs-bootcamp.cqc0oq2maxqm.us-west-2.rds.amazonaws.com/tomeraitz_db', {retry: {max: 10}})
const Pokemon = require('./orgnized')
const data = require('./poke_data.json')


class PokemonDB{
     constructor( ){
        this.pokemon =[]
        this.pokemon_type =[]
        this.trainer = []
        this.town = []
        this.pokemon_trainer = []
        this.nameAndTown =[]
        this.pokemonNameType =[]
        this.pokemonNameOwner=[]
        this.pokemonName = []
    }

    importData(){
        const p = new Pokemon(data)
        p.createPokemon_type()
        p.createPokemon()
        p.createTownAndTrainer()
        p.createTrainer_Pokemon()

        this.pokemon = p.pokemon
        this.pokemon_type =p.pokemon_type
        this.trainer = p.trainer
        this.town = p.town
        this.pokemon_trainer = p.pokemon_trainer
        
    }

    isertPokemonTypeToDB(){
        this.pokemon_type.forEach(p => {
           sequelize
                .query(`INSERT INTO pokemon_type VALUES (${p.id},'${p.type}')`)
                .then(function (result) {
                    console.log(result)
                })
        })
    }

    isertPokemonToDB(){
        this.pokemon.forEach(p => {
           sequelize
                .query(`INSERT INTO pokemon VALUES (${p.id}, '${p.name}', ${p.type}, ${p.height} , ${p.weight})`)
                .then(function (result) {
                    console.log(result)
                })
        })
    }

    isertTownToDB(){
        this.trainer.forEach(p => {
           sequelize
                .query(`INSERT INTO trainer VALUES (${p.id}, '${p.town_name}')`)
                .then(function (result) {
                    console.log(result)
                })
        })
    }

    isertTrainerToDB(){
        this.trainer.forEach(p => {
           sequelize
                .query(`INSERT INTO trainer VALUES (${p.id}, '${p.name}', ${p.town_id})`)
                .then(function (result) {
                    console.log(result)
                })
        })
    }

    isertPokemonTrainerToDB(){
        this.pokemon_trainer.forEach(p => {
           sequelize
                .query(`INSERT INTO pokemon_trainer VALUES (${p.pokemon_id}, ${p.trainer_id})`)
                .then(function (result) {
                    console.log(result)
                })
        })
    }

    heaviest(){
        sequelize
        .query("SELECT MAX(weight) AS weight FROM pokemon")
        .spread(function (results, metadata) {
            console.log(results)
        })
    }

  async trainerNameAndTown(){
    let results = await  sequelize
        .query(`SELECT trainer.name AS name, 
                        town.town_name AS town_name 
                FROM trainer 
                JOIN town ON  trainer.town_id = town.town_id`)
        results = JSON.parse(JSON.stringify(results[0]))
        this.nameAndTown = results
    }

    async findByType(typeName){
        let results = await  sequelize
            .query(`SELECT pokemon.name AS name
                    FROM pokemon 
                    JOIN pokemon_type ON  pokemon.taype_id = pokemon_type.taype_id
                    WHERE pokemon_type.taype like '%${typeName}%'`)
            results = JSON.parse(JSON.stringify(results[0]))
            results.forEach(p=>{
                this.pokemonNameType.push(p.name)
            })
        }

    async findOwners(pokemonName){
            let results = await  sequelize
                .query(`SELECT trainer.name AS name
                        FROM pokemon 
                        JOIN pokemon_trainer ON  pokemon.id = pokemon_trainer.pokemon_id
                        JOIN trainer ON trainer.id = pokemon_trainer.trainer_id
                        WHERE pokemon.name like '%${pokemonName}%'`)
                results = JSON.parse(JSON.stringify(results[0]))
                results.forEach(p=>{
                    this.pokemonNameOwner.push(p.name)
                })
            }

        async findRoster(trainerName){
            let results = await  sequelize
                .query(`SELECT pokemon.name AS name
                        FROM pokemon 
                        JOIN pokemon_trainer ON  pokemon.id = pokemon_trainer.pokemon_id
                        JOIN trainer ON trainer.id = pokemon_trainer.trainer_id
                        WHERE trainer.name like '%${trainerName}%'`)
                results = JSON.parse(JSON.stringify(results[0]))
                results.forEach(p=>{
                    this.pokemonName.push(p.name)
                })
            }
}

const pokemonDB = new PokemonDB()

const ex = async function(){
   await pokemonDB.importData()
   await pokemonDB.heaviest()
   await pokemonDB.trainerNameAndTown()
   await console.log(pokemonDB.nameAndTown)
   await pokemonDB.findByType("grass")
   await console.log(pokemonDB.pokemonNameType)
   await pokemonDB.findOwners("gengar")
   await console.log(pokemonDB.pokemonNameOwner)
   await pokemonDB.findRoster("Loga")
   await console.log(pokemonDB.pokemonName)
}

ex()




