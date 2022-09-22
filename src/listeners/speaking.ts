import { Client} from "discord.js"

export default (client: Client): void =>{
    client.on('speaking', async (user, speaking) => {
        console.log("1");
        if (speaking.has('SPEAKING')) {
            console.log("I HEAR SOMETHING");
        }
      })
}
