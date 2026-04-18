# STEP-BY-STEP EXECUTION

# STEP 1 — Start Everything

docker-compose down -v
 
docker-compose up -d


# STEP 2 — Initialize CONFIG Replica Set

docker exec -it config1 mongosh --port 27019

rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [
    { _id: 0, host: "config1:27019" },
    { _id: 1, host: "config2:27019" },
    { _id: 2, host: "config3:27019" }
  ]
})

- Wait for PRIMARY

rs.status()

- Wait until:

PRIMARY


# STEP 3 — Restart mongos
docker restart mongos


# STEP 4 — Initialize SHARD 1 (3 nodes)

docker exec -it shard1a mongosh --port 27018

rs.initiate({
  _id: "shard1ReplSet",
  members: [
    { _id: 0, host: "shard1a:27018" },
    { _id: 1, host: "shard1b:27018" },
    { _id: 2, host: "shard1c:27018" }
  ]
})


# STEP 5 — Initialize SHARD 2 (3 nodes)

docker exec -it shard2a mongosh --port 27018

rs.initiate({
  _id: "shard2ReplSet",
  members: [
    { _id: 0, host: "shard2a:27018" },
    { _id: 1, host: "shard2b:27018" },
    { _id: 2, host: "shard2c:27018" }
  ]
})


# STEP 6 — Connect to mongos

docker exec -it mongos mongosh

# STEP 7 — Add Shards

sh.addShard("shard1ReplSet/shard1a:27018")
sh.addShard("shard2ReplSet/shard2a:27018")


# STEP 8 — Enable Sharding
sh.enableSharding("blogDB")


# STEP 9 — Shard Collections
sh.shardCollection("blogDB.blogs", { category: 1, _id: "hashed" })
sh.shardCollection("blogDB.comments", { blog: 1 })


# STEP 10 — Verify
sh.status()
