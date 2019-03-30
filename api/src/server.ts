import { app } from "./app";

const port = app.get("port");
const env = app.get("env");
const server = app.listen(port, () => {
	console.log(`App is running on http://localhost:${port} in ${env} mode`);
});

export default server;