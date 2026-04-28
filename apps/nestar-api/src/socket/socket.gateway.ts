import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';

//@WebSocketGateway - bu class WebSocket server ekanini bildiradi
@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0; // nechta user ulanganini sanaydi.

	public afterInit(server: Server) {
		this.logger.log(`WebSocket Server Initialized total: ${this.summaryClient}`); //WebSocket server ishga tushganda bir marta ishlaydi va server start bulganda log chiqaradi
	}

	// yangi user connect/disconnect bulganda ishlaydigan mantiqlar
	handleConnection(client: WebSocket, ...args: any[]) {
		this.summaryClient++; // bir user ulanganda sonini 1taga oshiriw
		this.logger.log(`== Client connected total: ${this.summaryClient} ==`);
	}

	handleDisconnect(client: WebSocket) {
		this.summaryClient--; // bir user disconnect bulganda sonini 1taga kamaytirish
		this.logger.log(`== Client disconnected left total: ${this.summaryClient} ==`);
	}

	@SubscribeMessage('message')
	public handleMessage(client: WebSocket, payload: any): string {
		return 'Hello world!';
	} //Client {"event": "message"} yuborsa, server javob beradi "Hello world!" deb.
}

/**
User kirdi → handleConnection → summaryClient++
User chiqdi → handleDisconnect → summaryClient--
User xabar yubordi → handleMessage → "Hello world!" qaytaradi
 */
