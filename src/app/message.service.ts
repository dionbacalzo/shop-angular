import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class MessageService {
	messageSubject: Subject<any> = new Subject<any>();
	messages: Message<{}>[];

	add(message: {}) {
		this.messages.push(new Message(message));
		this.messageSubject.next(new Message(message));
	}

	clear() {
		this.messages = [];
		this.messageSubject.next(this.messages);
	}
}

export class Message<T> {
	title: string;
	type: string;
	body: string;

	constructor(
		options: { title?: string; type?: string; body?: string } = {}
	) {
		this.title = options.title;
		this.type = options.type;
		this.body = options.body;
	}
}
