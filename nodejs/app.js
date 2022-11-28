const express = require("express");
const app = express();
const redis = require("redis");

require("dotenv").config();
let counter = 0;

async function main() {
	const client = redis.createClient({
		url: "redis://10.20.30.2:6379",
	});
	const subscriber = client.duplicate();
	const publisher = client.duplicate();

	await subscriber.connect();
	await publisher.connect();

	subscriber.subscribe("counter", (msg) => {
		console.log(msg);
		counter += 1;
	});

	app.get("/countup", (req, res) => {
		publisher.publish("counter", "counting!");
		res.send("countup");
	});
}

main();

const PORT = process.env.PORT || 3000;

app.get("/count", (req, res) => {
	let msg = `count: ${counter}`;
	res.send(msg);
});

app.listen(PORT, () => {
	console.log("App listening on port: " + PORT);
});
