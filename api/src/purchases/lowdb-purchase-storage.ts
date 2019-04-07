import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import uuidv4 from 'uuid/v4';

const adapter = new FileSync('db.json');
const db = low(adapter);
const purchasesStr = 'purchases';

export async function init() {
	db.defaults({ purchases: [] })
		.write();
};

interface Insert {
	symbol: string;
	price_4_dec: number;
	num_shares: number;
	max_4_dec: number;
	time: number;
}

export const insert = async function (fields: Insert) {
	const entry = { id: uuidv4(), ...fields };
	db.get(purchasesStr)
		.push(entry)
		.write();
	return entry;
};

export const selectAll = async function (symbol?: string) {
	if (symbol) {
		return db.get(purchasesStr)
			.filter({ symbol })
			.value();
	} else {
		return db.get(purchasesStr)
			.value();
	}
};

export const selectById = async function (id: string) {
	return db.get(purchasesStr)
		.find({ id })
		.value();
};
