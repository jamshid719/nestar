import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import * as url from 'url';
import { Member } from '../libs/dto/member/member';

//FR.ga datalarni yuborish va qabul qilish interface
interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

//Yangi user qushilganda qolgan userlarga data yuborish kk buladi
interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string; //joined yoki left bulganligini aytish un
}

//@WebSocketGateway - bu class WebSocket server ekanini bildiradi
@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0; // nechta user ulanganini sanaydi.
	private clientsAuthMap = new Map<WebSocket, Member>();
	//WebSocket - key sifatida, Member esa value sifatida kelayapti
	private messagesList: MessagePayload[] = [];

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized & total [${this.summaryClient}]`); //WebSocket server ishga tushganda bir marta ishlaydi va server start bulganda log chiqaradi
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true); //Bu yerdagi url.parse — URL ni bulaklarga ajratadi, true esa query ni obyektga aylantiradi.
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		} //null — xato emas, shunchaki "bu user login qilmagan" degani, WebSocket uzilib qolmaydi.
	}

	// yangi user connect/disconnect bulganda ishlaydigan mantiqlar
	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summaryClient++; // bir user ulanganda sonini 1taga oshiriw

		//client: authMember =>  key: value (shu tarzda saqlash kk => lekin buni oddiy obj. sifatida saqlay olmaymiz, sababi obj.ning key bu faqat stringdan iborat buladi, bu yerda esa key sifatida kelayotgan client alohida bir obj. va buni biz string sifatida saqlay olmaymiz, shunday hollarda JSda Map() datatype foydalanamiz.)
		this.clientsAuthMap.set(client, authMember);
		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(`Connection [${clientNick}] & total [${this.summaryClient}]`);

		//Yangi user ulanganligini, boshqalarga malum qilish
		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient, //tepeda 1taga oshgan
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);

		//CLIENT MESSAGES(3 holatda msg send buladi, pastda izohi bor => bunda faqat biz yangi ulangan clientga yuborayapmiz)
		client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient--; // bir user disconnect bulganda sonini 1taga kamaytirish.
		this.clientsAuthMap.delete(client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Disconnection [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'left',
		};
		//client - disconnect
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: string): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		const newMessage: MessagePayload = { event: 'message', text: payload, memberData: authMember };

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);
		this.messagesList.push(newMessage);
		if (this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5); //ohirgi 5ta msg saqlanadi

		this.emitMessage(newMessage); //bu esa ohirgi saqlangan 5ta msg ni yangi ulangan clientlarga yuboradi.
	}

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

/*
?MESSAGE TARGET: 3 xil buladi
1.Client (ulangan clientning uziga)
2.Broadcast(except clientga(disconnected))
3.Emit(hamma clientga)

**/

/**
User kirdi → handleConnection → summaryClient++
User chiqdi → handleDisconnect → summaryClient--
User xabar yubordi → handleMessage → "Hello world!" qaytaradi

//?WebSocket ning asosiy metodlari:
client.readyState  // holati (0,1,2,3)
client.send()      // xabar yuborish
client.close()     // ulanishni yopish
client.onmessage   // xabar kelganda
client.onopen      // ulanganda
client.onerror     // xato bo'lganda
 */
