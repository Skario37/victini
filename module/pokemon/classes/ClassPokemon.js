// POKEMON CLASS
class Pokemon {
    constructor(pokemon) {
        this._id = pokemon.id;
        this.uuid = pokemon.uuid;
        this.created_date = pokemon.createdDate;
        // Set to default undetermined values
        pokemon.names ? this.names = pokemon.names : this.setNames();
        pokemon.nickname ? this.nickname = pokemon.nickname : this.setNickname();
        pokemon.pid ? this.pid = pokemon.pid : this.generatePID();

        pokemon.color ? this.color = pokemon.color : this.setColor();

        pokemon.gender ? this.gender = pokemon.gender : this.setGender();
        pokemon.shiny ? this.shiny = pokemon.shiny : this.setShiny();
        pokemon.ball ? this.ball = pokemon.ball : this.setBall();

        pokemon.happiness ? this.happiness = pokemon.happiness : this.setHappiness();
        pokemon.origin_trainer ? this.origin_trainer = pokemon.origin_trainer : this.setOriginTrainer();
        pokemon.starter ? this.starter = pokemon.starter : this.setStarter();
        pokemon.egg ? this.egg = pokemon.egg : this.setEgg();
        pokemon.hatch_counter ? this.hatch_counter = pokemon.hatch_counter : this.setHatchCounter();
        
        pokemon.varieties ? this.varieties = pokemon.varieties : this.setVarieties();
        pokemon.current_variety ? this.current_variety = pokemon.current_variety : this.setCurrentVariety();
        pokemon.forms ? this.forms = pokemon.forms : this.setForms();
        pokemon.current_form ? this.current_form = pokemon.current_form : this.setCurrentForm();
        pokemon.ability ? this.ability = pokemon.ability : this.setAbility();
        pokemon.nature ? this.nature = pokemon.nature : this.setNature();

        pokemon.experience ? this.experience = pokemon.experience : this.setExperience();
        pokemon.stats ? this.stats = pokemon.stats : this.setStats();
        pokemon.item ? this.item = pokemon.item : this.setItem();
        pokemon.moves ? this.moves = pokemon.moves : this.setMoves();

        pokemon.encountered_location ? this.encountered_location = pokemon.encountered_location : this.setEncounteredLocation();
    }

    setNames        (names = "?????")   { this.names = names; }
    getNames        ()                  { return this.names; }
    setNickname     (nickname = '')     { this.nickname = nickname; }
    getNickname     ()                  { return this.nickname; }
    setPID          (pid = 0)           { this.pid = pid; }
    getPID          ()                  { return this.pid; }

    setColor        (color = "black")      { this.color = color; }
    getColor        ()                  { return this.color; }
    
    setHeight       (height = -1)       { this.current_variety.height = height; }
    getHeight       ()                  { return this.current_variety.height; }
    setHeightCoef   (heightCoef = 1)    { this.current_variety.height_coef = heightCoef; }
    getHeightCoef   ()                  { return this.current_variety.height_coef; }
    setWeight       (weight = -1)       { this.current_variety.weight = weight; }
    getWeight       ()                  { return this.current_variety.weight; }
    setWeightCoef   (weightCoef = 1)    { this.current_variety.weight_coef = weightCoef; }
    getWeightCoef   ()                  { return this.current_variety.weight_coef; }
    setGender       (gender = 3)        { this.gender = gender; }
    getGender       ()                  { return this.gender; }
    setShiny        (shiny = false)     { this.shiny = shiny; }
    getShiny        ()                  { return this.shiny; }
    setBall         (ball = null)       { this.ball = ball; }
    getBall         ()                  { return this.ball; }

    setHappiness        (happiness = 50)            { this.happiness = happiness; }
    getHappiness        ()                          { return this.happiness; }
    setOriginTrainer    (originTrainer = "?????")   { this.origin_trainer = originTrainer; }
    getOriginTrainer    ()                          { return this.origin_trainer; }
    setStarter          (starter = false)           { this.starter = starter; }
    getStarter          ()                          { return this.starter; }
    setEgg              (egg = false)               { this.egg = egg; }
    getEgg              ()                          { return this.egg; }
    setHatchCounter     (counter = 0)               { this.hatch_counter = counter; }
    getHatchCounter     ()                          { return this.hatch_counter; }
    
    setVarieties        (varieties = null)        { this.varieties = varieties; }
    getVarieties        ()                        { return this.varieties; }
    setCurrentVariety   (variety = null)          { this.current_variety = variety; }
    getCurrentVariety   ()                        { return this.current_variety; }
    setForms            (forms = null)            { this.forms = forms; }
    getForms            ()                        { return this.forms; }
    setCurrentForm      (form = null)             { this.current_form = form; }
    getCurrentForm      ()                        { return this.current_form; }
    setAbility          (ability = null)          { this.ability = ability; }
    getAbility          ()                        { return this.ability; }
    setNature           (nature = null)           { this.nature = nature; }
    getNature           ()                        { return this.nature; }

    setExperience       (experience = null)       { this.experience = experience; }
    getExperience       ()                        { return this.experience; }
    
    setStats            (stats = null)            { this.stats = stats; }
    getStats            ()                        { return this.stats; }

    setMoves            (moves = null)            { this.moves = moves; }
    getMoves            ()                        { return this.moves; }

    setItem             (item = null)             { this.item = item; }
    getItem             ()                        { return this.item; }

    setEncounteredLocation  (location = "?????")  { this.encountered_location = location; }
    getEncounteredLocation  ()                    { return this.encountered_location; }

    generatePID(bits) {
      let min = 0;
      let max = Math.floor(Math.pow(2, bits));
      let pid = Math.floor(Math.random() * (max - min)) + min;
      this.setPID(pid);
    }
}

module.exports = Pokemon;