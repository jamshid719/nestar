import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';

//FR.ga datalarni yuborish va qabul qilish interface
interface MessagePayload {
	event: string;
	text: string;
}

//Yangi user qushilganda qolgan userlarga data yuborish kk buladi
interface InfoPayload {
	event: string;
	totalClients: number;
}

//@WebSocketGateway - bu class WebSocket server ekanini bildiradi
@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0; // nechta user ulanganini sanaydi.

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized & total [${this.summaryClient}]`); //WebSocket server ishga tushganda bir marta ishlaydi va server start bulganda log chiqaradi
	}

	// yangi user connect/disconnect bulganda ishlaydigan mantiqlar
	handleConnection(client: WebSocket, ...args: any[]) {
		this.summaryClient++; // bir user ulanganda sonini 1taga oshiriw
		this.logger.verbose(`Connection & total [${this.summaryClient}]`);

		//Yangi user ulanganligini, boshqalarga malum qilish
		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient, //tepeda 1taga oshgan
		};
		this.emitMessage(infoMsg);
	}

	handleDisconnect(client: WebSocket) {
		this.summaryClient--; // bir user disconnect bulganda sonini 1taga kamaytirish
		this.logger.verbose(`Disconnection & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
		};
		//client - disconnect
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: string): Promise<void> {
		const newMessage: MessagePayload = { event: 'message', text: payload };
		this.logger.verbose(`NEW MESSAGE: ${payload}`);
		this.emitMessage(newMessage);
	} //Client {"event": "message"} yuborsa, server javob beradi "Hello world!" deb.

	//Disconnect bulgan userdan tashqari bowqal hammaga xabar yuborish
	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	//Yangi user kirganligini qolganlarga xabar berish methodi
	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

/**
User kirdi → handleConnection → summaryClient++
User chiqdi → handleDisconnect → summaryClient--
User xabar yubordi → handleMessage → "Hello world!" qaytaradi
 */
