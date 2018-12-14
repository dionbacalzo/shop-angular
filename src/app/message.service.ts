import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class MessageService {
	messageSubject: Subject<any> = new Subject<any>();
	messages: Message<{}>[] = [];

	add(message: any) {
		if (message instanceof Message) {
			this.messages.push(message);
		} else {
			this.messages.push(new Message(message));
		}
		this.messageSubject.next(new Message(message));
	}

	clear() {
		if (this.messages && this.messages.length) {
			let index: number = this.messages.length - 1;			
			while (index >= 0) {				
				let currentPersistTime = this.messages[index].getPersist();
				if (this.messages[index].getPersist() == 0) {
					this.messages.splice(index, 1);
				} else if (currentPersistTime > 0) {
					currentPersistTime -= 1;
					this.messages[index].setPersist(currentPersistTime);
				} else {
					this.messages[index].setPersist(0);
					this.messages.splice(index, 1);
				}
				index -= 1;
			}			
		}
		this.messageSubject.next(this.messages);
	}
}

export class Message<T> {
	private type: string;
	private messageDisplay: string;
	/**
	 *	persist can have values 'none', 'once', and 'always'
	 *	if the value is none the message will be deleted with the next use of the clear function
	 *	if the the value is once it will retain after one more display
	 *   if the value is numeric it will display the number of times until it reacher 0
	 */
	private persist: number;

	constructor(
		options: {
			type?: string;
			messageDisplay?: string;
			persist?: number;
		} = {}
	) {
		this.type = options.type;
		this.messageDisplay = options.messageDisplay;
		if (!options.persist) {
			this.persist = 0;
		} else {
			this.persist = options.persist;
		}
	}

	setType(type: string) {
		this.type = type;
	}

	getType() {
		return this.type;
	}

	setMessageDisplay(messageDisplay: string) {
		this.messageDisplay = messageDisplay;
	}

	getMessageDisplay() {
		return this.messageDisplay;
	}

	setPersist(persist: number) {
		this.persist = persist;
	}

	getPersist() {
		if (!this.persist) {
			this.persist = 0;
		}
		return this.persist;
	}
}

export class ErrorMessage<T> extends Message<T> {
	errorInfo: string;

	constructor(
		options: {
			errorInfo?: string;
			type?: string;
			messageDisplay?: string;
			persist?: number;
		} = {}
	) {
		super(options);
		this.errorInfo = options.errorInfo;
	}
}
