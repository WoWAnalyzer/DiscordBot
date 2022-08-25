import path from "path";
import { ShardingManager } from "discord.js";

export default function sharding(token: string | undefined) {
  const manager = new ShardingManager(path.resolve(__dirname, "./bot.js"), {
    // 'auto' handles shard count automatically
    totalShards: "auto",
    token,
  });

  manager.on("shardCreate", (shard) =>
    console.log(`Shard ${shard.id} launched`)
  );
  manager.spawn();
}
