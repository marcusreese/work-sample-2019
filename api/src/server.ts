import { app } from './app';
import { init } from './purchases/purchases.storage';

const port = app.get('port');
const env = app.get('env');
init().then(() => {
	app.listen(port, () => {
		console.log(`App is running on http://localhost:${port} in ${env} mode`);
	});
});
