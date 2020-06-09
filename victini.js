/**
 * Project VictiniBot
 *
 * Vars and Functions
 *   startWithCamelCase
 *
 * Global Vars and Constants
 *   VARUPPERCASE
 *
 * @author Skario (Kévin Leblanc)
 *
 */

// Check node version
 if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");


// Charge la librairie discord.js
const DISCORD = require('discord.js');
// On charge aussi ce qu'on a besoin
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

// C'est le client
const VICTINI = new DISCORD.Client();

// Charge le config
VICTINI.config = require('./config.js');
// Charge notre logger
VICTINI.logger = require("./module/logger");
// Charge les requêtes de la base de donnée
// Make database connexion
VICTINI.database = require('nano')( { url: `http://${VICTINI.config.database.username}:${VICTINI.config.database.userpass}@localhost:5984`, requestDefaults: { jar : true } } );
VICTINI.database.db_trainer = {
  request : require("./database/db_trainer/request.js"),
  template : require('./database/db_trainer/template.js'),
}
VICTINI.database.db_server = {
  request : require("./database/db_server/request.js"),
}

// Useful functions
require("./module/function.js")(VICTINI);
require("./module/moderation.js")(VICTINI);
require("./module/permLevel.js")(VICTINI);
require("./module/number.js")(VICTINI);

// Pokemon functions
require("./module/pokemon/settings.js")(VICTINI);
require("./module/pokemon/pokemon.js")(VICTINI);
require("./module/pokemon/experience.js")(VICTINI);
require("./module/pokemon/stats.js")(VICTINI);
require("./module/pokemon/emoji.js")(VICTINI);

// Home functions
require("./module/home/home.js")(VICTINI);

// Alias et commandes stockées dans une collection
VICTINI.commands = new Enmap();
VICTINI.aliases = new Enmap();
VICTINI.settings = new Enmap({name: "settings"});

const init = async () => {

  // On charge les **commandes** dans la mémoire, comme une collection, ils sont
  // accessibles ici et partout ailleurs
  const cmdFiles = await readdir("./command/", { withFileTypes : true });
  cmdFiles.module = { length : 0 };
  cmdFiles.command = { length : 0 };
  cmdFiles.forEach( f => {
    if (f.isDirectory()) cmdFiles.module.length++;
    if (f.isFile() && f.name.endsWith(".js")) cmdFiles.command.length++;
  });
  // Loading essential commands before everything
  VICTINI.logger.log(`Loading ${cmdFiles.command.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.name.endsWith(".js") && !f.isFile()) return;
    const response = VICTINI.loadCommand(f.name);
    if (response) console.log(response);
  });
  // Loading every modules
  VICTINI.logger.log(`Loading ${cmdFiles.module.length} modules.`);
  cmdFiles.forEach(async f => {
    if (!f.isDirectory()) return;
    const response = await VICTINI.loadModuleCommand(f.name);
    if (response) console.log(response);
  });


  // On charge ensuite les evenements
  const evtFiles = await readdir("./event/", { withFileTypes : true });
  evtFiles.event = { length : 0 };
  evtFiles.forEach( f => {
    if (f.isFile() && f.name.endsWith(".js")) evtFiles.event.length++;
  });
  VICTINI.logger.log(`Loading a total of ${evtFiles.event.length} events.`);
  evtFiles.forEach(f => {
    if (!f.name.endsWith(".js") && !f.isFile()) return;
    const eventName = f.name.split(".")[0];
    VICTINI.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./event/${f.name}`);
    VICTINI.on(eventName, event.bind(null, VICTINI));
  });
  VICTINI.login(VICTINI.config.token);
  VICTINI.home.init();
};

init();


/*


VICTINI.on('ready', ready => {

  TWITTER_TWITTER.startRetrievingTimeline( VICTINI.channels.get( CONFIG.channel.twitterId ) );

  if ( modules.apparition.state ) {
    new APPARITION.Apparition( VICTINI.guilds.get( CONFIG.guild.id ),  CONFIG.channel.kanto.id, CONFIG.channel.kanto.nom );
    APPARITION_VERIFICATION.start( VICTINI.guilds.get( CONFIG.guild.id ), CONFIG.channel.kanto.nom );
  }
});







witch ( cmdLowerCase ) {
		// Module System ne peut pas être désactivé
		//modules
		case "modules":
		// module
		case "module":
			break;



  // GivePokemon @ DonnerPokemon
    case "givepokemon":
    case "donnerpokemon":
			if ( ! modules.manager.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Manager** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Manager** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
			}
  			break;
		// Module Moderation
		// showwarns @ warns @ avertissements
		case "showwarns":
		case "warns":
		case "avertissements":
		// addwarn @ warn @ avertissement @ avertir
		case "addwarn" :
		case "warn":
		case "avertissement":
		case "avertir":
		// delWarn @ unwarn @ desavertir
		case "delwarn":
		case "unwarn":
		case "desavertir":
		  	if ( ! modules.moderation.state ) {
          var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
            return langue;
          });
          switch ( langue ) {
            case "en":
              SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Moderation** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
              break;
            case "fr":
            default:
              SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Modération** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
          }
          return;
				}
  			break;
		// Module récompense
		// daily @ bonus
		case "daily":
		case "bonus":
		// steal @ voler
		case "steal":
		case "voler":
    // lottery @ loterie
    case "loterie" :
    case "lottery" :
			if ( ! modules.recompense.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Reward** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Récompense** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
			}
			break;
    // Module bienvenue
    // start @ Commencer
    case "start":
    case "commencer":
    // choose @ choisir
    case "choose":
    case "choisir":
      if ( ! modules.bienvenue.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Welcome** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Bienvenue** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
      }
      break;
    // Module Inventaire
    // Bag @ Sac
    case "bag":
    case "sac":
    // Profile @ Profil
    case "profile":
    case "profil":
    // Card @ Carte
    case "card":
    case "carte":
    // Team @ Equipe
    case "team":
    case "equipe":
    // Box @ Boite
    case "box":
    case "boite":
    // Character @ Characters @ Personnage @ Personnages
    case "character":
    case "personnage":
    case "characters":
    case "personnages":
      if ( ! modules.inventaire.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Inventory** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Inventaire** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
      }
      break;
    // Module Pokemon
    // Throw @ Lancer
    case "throw":
    case "lancer":
      if ( ! modules.pokemon.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Pokémon** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Pokémon** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
      }
      break;
    // Module Market
    case "market":
    case "marche":
      if ( message.channel.id != 536315533365084200 ) return;
      if ( ! modules.marche.state ) {
        var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
          return langue;
        });
        switch ( langue ) {
          case "en":
            SYSTEM_MESSAGE.send( message.channel, ":confused: Module **Market** is deactivated. If the behavior is abnormal please contact <@" + CONFIG.creator.id + ">.", 15 );
            break;
          case "fr":
          default:
            SYSTEM_MESSAGE.send( message.channel, ":confused: Le module **Marché** est désactivé. Si le comportement est anormal veuillez contacter <@" + CONFIG.creator.id + ">.", 15 );
        }
        return;
      }
      break;
    // Pas de module
    // Pokedex
    case "pokedex":
    case "pokédex":
    case "objetdex":
    case "itemdex":
      break;
    // Uniquement le createur
    case "test":
    case "scrap1":
      if ( message.author.id == CONFIG.creator.id ) break;
		default:
      var langue = await DATABASE_DRESSEUR.getLangue( message.author ).then( async langue => {
        return langue;
      });
      switch ( langue ) {
        case "en":
          SYSTEM_MESSAGE.send( message.channel, ":confused: I am confused, I can not find this command: " + cmd, 15 );
          break;
        case "fr":
        default:
          SYSTEM_MESSAGE.send( message.channel, ":confused: Je suis confus, je ne trouve pas cette commande : " + cmd, 15 );
      }
*/
