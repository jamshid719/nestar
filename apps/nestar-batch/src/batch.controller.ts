import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BatchController');

	constructor(private readonly batchService: BatchService) {}

	//DECORATORS

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY');
	}

	//JobSchedulers
	//Top larga doir batchRollback
	@Cron('0/30 * * * * *', { name: BATCH_ROLLBACK }) //kechasi soat 1da bir marta ishga tushadi
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	//kechasi soat 1 ning 20 sec. ishga tushadi
	@Cron('10/30 * * * * *', { name: BATCH_TOP_PROPERTIES })
	public async batchTopProperties() {
		try {
			this.logger['context'] = BATCH_TOP_PROPERTIES;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchTopProperties();
		} catch (err) {
			this.logger.error(err);
		}
	}

	//kechasi soat 1 ning 40 sec. ishga tushadi
	@Cron('20/30 * * * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchTopAgents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	/** 
	 	@Interval(1000)
	handleInterval() {
		this.logger.debug('INTERVAL TEST');
	}
	*/

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
