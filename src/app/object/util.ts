export class Util<T> {

	static extractData(res: Response) {
		const body = res;
		return body || {};
	}

}