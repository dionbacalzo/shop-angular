import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from '../../service/message.service';

@Component({
	selector: 'app-updatepage',
	templateUrl: './updatepage.component.html',
	styleUrls: ['./updatepage.component.css']
})
export class UpdatepageComponent implements OnInit {

	constructor(private titleService: Title, private messageService: MessageService) { }

	ngOnInit() {
		this.titleService.setTitle('Shop Display: Update');
		this.messageService.clear();
	}

}
