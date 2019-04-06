import { app } from './app';
import { prepDb } from './db';


const port = app.get('port');
const env = app.get('env');
// const server = 
prepDb().then(() => {
	app.listen(port, () => {
		console.log(`App is running on http://localhost:${port} in ${env} mode`);
	});
});

// export default server;