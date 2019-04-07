import { app } from './app';
// import { prepDb } from './abandoned-sqlite-db';
import { init } from './purchases/lowdb-purchase-storage';

const port = app.get('port');
const env = app.get('env');
// const server = 
init().then(() => {
	app.listen(port, () => {
		console.log(`App is running on http://localhost:${port} in ${env} mode`);
	});
});

// export default server;