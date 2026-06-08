require("dotenv").config();

const { App } = require("@slack/bolt");
const { timeStamp } = require("console");
const fs = require("fs");


let bottle = [];

try {
    bottle = JSON.parse(fs.readFileSync("bottles.json","utf-8"))
} catch (err) { 
    bottle = [];
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/bottle-about", async ({ command, ack, respond }) => {
 
  await ack();
  await respond({ text: "*BottleBot & The Great Bottle:*\n\nThe *BottleBot* and its *Great Bottle* have been around for centuries to come before being given a place in the vast ocean of *HackClub Slack*, where it has been sailing since its consecration on *June 7th, 2026*, and shall continue to do so till the end.\n\nYou shall consign your deepest messages anonymously through the spell followed by your message `/bottle-send [message]` to be stored in the great sacred bottle of *BottleBot*, and through `/bottle-read` you shall discern the secrets consigned by the very fellow mariners of this very great ocean.\n\nYou may also gauge the number of secrets in the great bottle of the *BottleBot* by invoking it through the wizardry spell of `/bottle-stats`.\n\n_Wishing you the best luck, fellow sailors!_\n\n-The Narrator" });
});

app.command("/bottle-send", async ({ command, ack, respond }) => {
  await ack();
  const secret = command.text.trim();
  
  if(!secret) {
    await respond({ text: "*Oh dumbo!,* where is the *secret* that needs to be *sealed* in your *consignment* dont forget it!\n\nTry again you failure with `/bottle-send [your_secret_message_dont_forget]`." });
    return;
}
  bottle.push({ msg: secret, timeStamp: Date.now()});
  fs.writeFileSync("bottles.json", JSON.stringify(bottle,null,2));
  await respond({text: "Your message has reached the confines of the great *Bottle!*"});
});

app.command("/bottle-read", async ({ command, ack, respond }) => {
 
  await ack();
  if(bottle.length === 0) {
    await respond({text: "Alas! ,the Bottle is *empty!*\n\nBut, Perhaps *you* are the *Chosen One* intended to send the first *secret* into the confines of the great *Bottle!*"});
    return;
};

  
  const random = bottle[Math.floor(Math.random() * bottle.length)];
  const minutes = Math.floor((Date.now() - random.timeStamp) /60000 );
  const timeAgo = minutes < 1 ? "just now" : minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`
  await respond({text: `*A message from the bottle* _(sealed ${timeAgo})_:\n> ${random.msg}`});
});

app.command("/bottle-stats", async ({ command, ack, respond }) => {
 
  await ack();
  const count = bottle.length;
  if(count === 1){
    return await respond({text: `*Ahoy, brave sailor!* Currently the bottle holds just *1 secret!* _So sad, right?_ Go fill it up, mate!`})
  }
  else if(count > 1){
    return await respond({text: `*Ahoy, brave sailor!* Currently the bottle holds *${count} secrets!*`})
  }  
  await respond({text: `_It is just sad to see that the bottle has just air!_`})
});

(async () => {
  await app.start();
  console.log("BottleBot has set its sail!");
})().catch(console.error);

