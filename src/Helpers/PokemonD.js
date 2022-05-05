import axios from 'axios'

async function getPokemon(url){
    const pokemonData = await axios.get(url)
    return pokemonData.data

}


  async function getPokemonList(){
    const pokeList = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0')
    return pokeList
  }

async function getPokemonNames(){
    const pokeNames = await getPokemonList()
    const result = pokeNames.data.results.map(c => {return {value: c.name}}) //format accepted on autocomplete (ant design)
    return result
}


async function getPokemonsData(urlList){

    const pokemonsData = await urlList.map(async (url) => {
        const data = await axios.get(url)
        return data.data
      })
    
     const result = Promise.all(pokemonsData).then(data => { //in order to not work with an array of promises
        return data
      })
      
      return result
    
}


async function getEvolution (url, name) {
  const especies = await axios.get(url)
  const evolutions = await axios.get(especies.data.evolution_chain.url)   
  
  return evolvedFrom(evolutions.data.chain, name)
}  
  
async function getEvolutionData (url){

  const especies = await axios.get(url)
  const evolutions = await axios.get(especies.data.evolution_chain.url)   
  const chain = evolutions.data.chain
 

  const arr = []

  function recursion(chain){
    //stores the name
    arr.push(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}/`)
    //see if there's an evolution
    if(chain.evolves_to.length > 0){
      recursion(chain.evolves_to[0])
      return
    }else{
      return 
    }
  }

  recursion(chain)
  const result = await getPokemonsData(arr)

  //in order to not return promises
  const res = Promise.all(result).then(data => {
    return data
  })
  
  return res
  
}




function evolvedFrom(chain, name){

    let mess = 'ninguno' 

    if(chain.species.name === name){
        return mess  
      }
    else{
      mess = chain.species.name

      if(chain.evolves_to[0].species.name === name){
        return mess
      }

      else{
        mess = chain.evolves_to[0].species.name
        if(chain.evolves_to[0].evolves_to[0].species.name === name){
        return mess
        }

      }
    }

  }



export {getPokemonsData, getPokemonList, getPokemonNames, getPokemon, getEvolution, getEvolutionData}
